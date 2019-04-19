// { "framework": "Vue"} 

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 315);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(33)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(12)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(13);
var IE8_DOM_DEFINE = __webpack_require__(37);
var toPrimitive = __webpack_require__(27);
var dP = Object.defineProperty;

exports.f = __webpack_require__(3) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(25)('wks');
var uid = __webpack_require__(16);
var Symbol = __webpack_require__(2).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(5);
var createDesc = __webpack_require__(15);
module.exports = __webpack_require__(3) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(42);
var defined = __webpack_require__(22);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(11);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(9);
var ctx = __webpack_require__(48);
var hide = __webpack_require__(8);
var has = __webpack_require__(4);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(40);
var enumBugKeys = __webpack_require__(23);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(5).f;
var has = __webpack_require__(4);
var TAG = __webpack_require__(7)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(25)('keys');
var uid = __webpack_require__(16);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(9);
var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(14) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 26 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(11);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(9);
var LIBRARY = __webpack_require__(14);
var wksExt = __webpack_require__(29);
var defineProperty = __webpack_require__(5).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(7);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(58);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(57);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = __webpack_require__(44);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof3 = __webpack_require__(30);

var _typeof4 = _interopRequireDefault(_typeof3);

var _urlParse = __webpack_require__(45);

var _urlParse2 = _interopRequireDefault(_urlParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var navigator = weex.requireModule('navigator');


var Utils = {
    UrlParser: _urlParse2.default,

    initIconFont: function initIconFont() {
        var domModule = weex.requireModule('dom');
        // domModule.addRule('fontFace', {
        //     'fontFamily': "iconfont",
        //     'src': "url('http://at.alicdn.com/t/font_404010_f29c7wlkludz33di.ttf')"
        // });
    },
    getNameSpance: function getNameSpance(url) {
        var modal = weex.requireModule('modal');
        var bundleUrl = url;
        var host = '';
        var path = '';
        var nativeBase = void 0;
        var isAndroidAssets = bundleUrl.indexOf('your_current_IP') >= 0 || bundleUrl.indexOf('file://assets/') >= 0;
        var isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0;
        if (isAndroidAssets) {
            nativeBase = 'file://assets/dist';
        } else if (isiOSAssets) {
            // file:///var/mobile/Containers/Bundle/Application/{id}/WeexDemo.app/
            // file:///Users/{user}/Library/Developer/CoreSimulator/Devices/{id}/data/Containers/Bundle/Application/{id}/WeexDemo.app/
            nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1);
        } else {
            var matches = /\/\/([^\/]+?)\//.exec(bundleUrl);
            var matchFirstPath = /\/\/[^\/]+\/([^\s]+)\//.exec(bundleUrl);
            if (matches && matches.length >= 2) {
                host = matches[1];
            }
            if (matchFirstPath && matchFirstPath.length >= 2) {
                path = matchFirstPath[1];
            }
            nativeBase = 'http://' + host + '/';
            // modal.toast({ message: path + '//--', duration: 1 })
            // console.log(nativeBase);
        }

        // in Native
        // let base = nativeBase + (!!path ? path + '/' : '');
        // return base
        //for test
        return nativeBase;
    },
    setBundleUrl: function setBundleUrl(url, jsFile, isweb) {
        var modal = weex.requireModule('modal');
        var bundleUrl = url;
        var host = '';
        var path = '';
        var nativeBase = void 0;
        var isAndroidAssets = bundleUrl.indexOf('file://assets/') >= 0;
        var isiOSAssets = bundleUrl.indexOf('.app') > 0;
        if (isAndroidAssets) {
            nativeBase = 'file://assets/dist';
        } else if (isiOSAssets) {
            //路由
            nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/index') + 1);
        } else {
            var matches = /\/\/([^\/]+?)\//.exec(bundleUrl);
            var matchFirstPath = /\/\/[^\/]+\/([^\s]+)\//.exec(bundleUrl);
            if (matches && matches.length >= 2) {
                host = matches[1];
            }
            if (matchFirstPath && matchFirstPath.length >= 2) {
                path = matchFirstPath[1];
            }
            nativeBase = 'http://' + host + '/';
            // modal.toast({ message: path + '//--', duration: 1 })
            // console.log(nativeBase);
        }
        var h5Base = 'index.html?page=';
        // in Native
        var base = nativeBase;
        if (isweb) {
            if (path === 'web' || path === 'dist') {
                base = nativeBase + h5Base + '/dist/';
            } else {
                base = nativeBase + h5Base + '';
            }
            // console.log(base);
        } else if (typeof navigator !== 'undefined' && (navigator.appCodeName === 'Mozilla' || navigator.product === 'Gecko')) {
            // check if in weexpack project
            if (path === 'web' || path === 'dist') {
                base = h5Base + '/dist/';
            } else {
                base = h5Base + '';
            }
        } else {
            base = nativeBase + (!!path ? path + '/' : '');
        }

        var newUrl = base + jsFile;
        modal.toast({ message: newUrl + '--', duration: 1 });
        return newUrl;
    },
    getUrlSearch: function getUrlSearch(url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = url.slice(url.indexOf('?') + 1).match(reg);
        if (r != null) {
            try {
                return decodeURIComponent(r[2]);
            } catch (_e) {
                return null;
            }
        }
        return null;
    },
    jump: function jump(to) {
        if (this.$router) {
            this.$router.push(to);
        }
    },
    jumpWeb: function jumpWeb(bundleUrl, _url) {
        var url = this.setBundleUrl(bundleUrl, '../webview.js?weburl=' + _url);

        console.log("jumpweb>>" + url);
        navigator.push({
            url: url,
            animated: true
        });
    },
    jumpUrl: function jumpUrl(bundleUrl, _url) {
        var url = this.setBundleUrl(bundleUrl, _url);
        console.log("jumpUrl>>" + url);
        navigator.push({
            url: url,
            animated: true
        });
    },
    _typeof: function _typeof(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    },
    isPlainObject: function isPlainObject(obj) {
        return Utils._typeof(obj) === 'object';
    },
    isString: function isString(obj) {
        return typeof obj === 'string';
    },
    isNonEmptyArray: function isNonEmptyArray() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        return obj && obj.length > 0 && Array.isArray(obj) && typeof obj !== 'undefined';
    },
    isObject: function isObject(item) {
        return item && (typeof item === 'undefined' ? 'undefined' : (0, _typeof4.default)(item)) === 'object' && !Array.isArray(item);
    },
    isEmptyObject: function isEmptyObject(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    decodeIconFont: function decodeIconFont(text) {
        // 正则匹配 图标和文字混排 eg: 我去上学校&#xe600;,天天不&#xe600;迟到
        var regExp = /&#x[a-z|0-9]{4,5};?/g;
        if (regExp.test(text)) {
            return text.replace(new RegExp(regExp, 'g'), function (iconText) {
                var replace = iconText.replace(/&#x/, '0x').replace(/;$/, '');
                return String.fromCharCode(replace);
            });
        } else {
            return text;
        }
    },
    mergeDeep: function mergeDeep(target) {
        for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            sources[_key - 1] = arguments[_key];
        }

        if (!sources.length) return target;
        var source = sources.shift();
        if (Utils.isObject(target) && Utils.isObject(source)) {
            for (var key in source) {
                if (Utils.isObject(source[key])) {
                    if (!target[key]) {
                        Object.assign(target, (0, _defineProperty3.default)({}, key, {}));
                    }
                    Utils.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, (0, _defineProperty3.default)({}, key, source[key]));
                }
            }
        }
        return Utils.mergeDeep.apply(Utils, [target].concat(sources));
    },
    appendProtocol: function appendProtocol(url) {
        if (/^\/\//.test(url)) {
            var bundleUrl = weex.config.bundleUrl;

            return 'http' + (/^https:/.test(bundleUrl) ? 's' : '') + ':' + url;
        }
        return url;
    },
    encodeURLParams: function encodeURLParams(url) {
        var parsedUrl = new _urlParse2.default(url, true);
        return parsedUrl.toString();
    },
    goToH5Page: function goToH5Page(jumpUrl) {
        var animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        var Navigator = weex.requireModule('navigator');
        var jumpUrlObj = new Utils.UrlParser(jumpUrl, true);
        var url = Utils.appendProtocol(jumpUrlObj.toString());
        Navigator.push({
            url: Utils.encodeURLParams(url),
            animated: animated.toString()
        }, callback);
    },

    env: {
        isTaobao: function isTaobao() {
            var appName = weex.config.env.appName;

            return (/(tb|taobao|淘宝)/i.test(appName)
            );
        },
        isTrip: function isTrip() {
            var appName = weex.config.env.appName;

            return appName === 'LX';
        },
        isBoat: function isBoat() {
            var appName = weex.config.env.appName;

            return appName === 'Boat' || appName === 'BoatPlayground';
        },
        isWeb: function isWeb() {
            var platform = weex.config.env.platform;

            return (typeof window === 'undefined' ? 'undefined' : (0, _typeof4.default)(window)) === 'object' && platform.toLowerCase() === 'web';
        },
        isIOS: function isIOS() {
            var platform = weex.config.env.platform;

            return platform.toLowerCase() === 'ios';
        },

        /**
         * 是否为 iPhone X
         * @returns {boolean}
         */
        isIPhoneX: function isIPhoneX() {
            var deviceHeight = weex.config.env.deviceHeight;

            if (Utils.env.isWeb()) {
                return (typeof window === 'undefined' ? 'undefined' : (0, _typeof4.default)(window)) !== undefined && window.screen && window.screen.width && window.screen.height && parseInt(window.screen.width, 10) === 375 && parseInt(window.screen.height, 10) === 812;
            }
            return Utils.env.isIOS() && deviceHeight === 2436;
        },
        isAndroid: function isAndroid() {
            var platform = weex.config.env.platform;

            return platform.toLowerCase() === 'android';
        },
        isAlipay: function isAlipay() {
            var appName = weex.config.env.appName;

            return appName === 'AP';
        },
        isTmall: function isTmall() {
            var appName = weex.config.env.appName;

            return (/(tm|tmall|天猫)/i.test(appName)
            );
        },
        isAliWeex: function isAliWeex() {
            return Utils.env.isTmall() || Utils.env.isTrip() || Utils.env.isTaobao();
        },
        supportsEB: function supportsEB() {
            var weexVersion = weex.config.env.weexVersion || '0';
            var isHighWeex = Utils.compareVersion(weexVersion, '0.10.1.4') && (Utils.env.isIOS() || Utils.env.isAndroid());
            var expressionBinding = weex.requireModule('expressionBinding');
            return expressionBinding && expressionBinding.enableBinding && isHighWeex;
        },


        /**
         * 判断Android容器是否支持是否支持expressionBinding(处理方式很不一致)
         * @returns {boolean}
         */
        supportsEBForAndroid: function supportsEBForAndroid() {
            return Utils.env.isAndroid() && Utils.env.supportsEB();
        },


        /**
         * 判断IOS容器是否支持是否支持expressionBinding
         * @returns {boolean}
         */
        supportsEBForIos: function supportsEBForIos() {
            return Utils.env.isIOS() && Utils.env.supportsEB();
        },


        /**
         * 获取weex屏幕真实的设置高度，需要减去导航栏高度
         * @returns {Number}
         */
        getPageHeight: function getPageHeight() {
            var env = weex.config.env;

            var navHeight = Utils.env.isWeb() ? 0 : Utils.env.isIPhoneX() ? 176 : 132;
            return env.deviceHeight / env.deviceWidth * 750 - navHeight;
        }
    },

    /**
     * 版本号比较
     * @memberOf Utils
     * @param currVer {string}
     * @param promoteVer {string}
     * @returns {boolean}
     * @example
     *
     * const { Utils } = require('@ali/wx-bridge');
     * const { compareVersion } = Utils;
     * console.log(compareVersion('0.1.100', '0.1.11')); // 'true'
     */
    compareVersion: function compareVersion() {
        var currVer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '0.0.0';
        var promoteVer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0.0.0';

        if (currVer === promoteVer) return true;
        var currVerArr = currVer.split('.');
        var promoteVerArr = promoteVer.split('.');
        var len = Math.max(currVerArr.length, promoteVerArr.length);
        for (var i = 0; i < len; i++) {
            var proVal = ~~promoteVerArr[i];
            var curVal = ~~currVerArr[i];
            if (proVal < curVal) {
                return true;
            } else if (proVal > curVal) {
                return false;
            }
        }
        return false;
    },

    /**
     * 分割数组
     * @param arr 被分割数组
     * @param size 分割数组的长度
     * @returns {Array}
     */
    arrayChunk: function arrayChunk() {
        var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

        var groups = [];
        if (arr && arr.length > 0) {
            groups = arr.map(function (e, i) {
                return i % size === 0 ? arr.slice(i, i + size) : null;
            }).filter(function (e) {
                return e;
            });
        }
        return groups;
    },
    truncateString: function truncateString(str, len) {
        var hasDot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var newLength = 0;
        var newStr = '';
        var singleChar = '';
        var chineseRegex = /[^\x00-\xff]/g;
        var strLength = str.replace(chineseRegex, '**').length;
        for (var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) !== null) {
                newLength += 2;
            } else {
                newLength++;
            }
            if (newLength > len) {
                break;
            }
            newStr += singleChar;
        }

        if (hasDot && strLength > len) {
            newStr += '...';
        }
        return newStr;
    },

    //获取cookie、
    getCookie: function getCookie(name) {
        var arr,
            reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) return arr[2];else return null;
    },

    //设置cookie,增加到vue实例方便全局调用
    setCookie: function setCookie(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
    },

    //删除cookie
    delCookie: function delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },

    formatDate: function formatDate(time) {
        var date = new Date(time);
        return this.formatDatePattern(date, "yyyy-MM-dd hh:mm:ss");
    },

    formatDatePattern: function formatDatePattern(date, fmt) {
        if (!date) {
            return;
        }

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        var o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                var str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str));
            }
        }
        return fmt;
    },
    padLeftZero: function padLeftZero(str) {
        return ('00' + str).substr(str.length);
    }
};

exports.default = Utils;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(11);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(13);
var dPs = __webpack_require__(68);
var enumBugKeys = __webpack_require__(23);
var IE_PROTO = __webpack_require__(24)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(35)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(51).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(3) && !__webpack_require__(12)(function () {
  return Object.defineProperty(__webpack_require__(35)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(14);
var $export = __webpack_require__(17);
var redefine = __webpack_require__(41);
var hide = __webpack_require__(8);
var Iterators = __webpack_require__(20);
var $iterCreate = __webpack_require__(65);
var setToStringTag = __webpack_require__(21);
var getPrototypeOf = __webpack_require__(70);
var ITERATOR = __webpack_require__(7)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(40);
var hiddenKeys = __webpack_require__(23).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(4);
var toIObject = __webpack_require__(10);
var arrayIndexOf = __webpack_require__(62)(false);
var IE_PROTO = __webpack_require__(24)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(32);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(22);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(78);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var required = __webpack_require__(84)
  , qs = __webpack_require__(83)
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
  , left = new RegExp('^'+ whitespace +'+');

/**
 * Trim a given string.
 *
 * @param {String} str String to trim.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(left, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address) {          // Sanitize what is left of the address
    return address.replace('\\', '/');
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof global !== 'undefined') globalVar = global;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address) {
  address = trimLeft(address);
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(85)))

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.apiURL = undefined;

var _typeof2 = __webpack_require__(30);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*var stream = weex.requireModule('stream');
var modal = weex.requireModole('modal');*/

var apiURL = {

    //测试本机地址
    // baseurl: 'http://192.168.3.118:8888/web/',
    //开发地址
    baseurl: 'https://www.51bb8.com/web/',

    //路径地址
    // basepath: 'http://192.168.6.48:8080/dist/',
    basepath: 'file://assets/dist/',

    //开发地区获取地址(包括测试)
    basishost: 'http://192.168.1.235:8085',

    //生产地区获取地址
    //basishost: 'http://www.awakenpay.com/',

    //开发图片上传下载地址(包括测试)
    basisimg: 'http://192.168.1.235:8000',

    //生产图片上传下载地址
    //basisimg: 'http://www.awakenpay.com/',
    webSocketUrl: ''
};

exports.apiURL = apiURL;

// function getHostPort() {
// var hostname = typeof CURRENT_IP === 'string' ? CURRENT_IP : location.hostname
// if (location) {
//     var protocol = location.protocol + '//'
//     var port = location.port ? ':' + location.port : ''
//         //TODO
//     port = ':8888'
//     var url = protocol + hostname + port
// } else {
//     var url = 'http://' + hostname + ':8888'
//     return url
// }

//生产地址
// return 'www.awakenpay.com'

//测试本机地址
//     return '192.168.3.158:8888'

// }

exports.getParameterByName = function (name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

function getBaseUrl(bundleUrl, isnav, images) {

    var rootpath = images;
    if (!rootpath) {
        rootpath = "dist";
        // rootpath = "merchant/dist"
    }
    bundleUrl = new String(bundleUrl);
    var nativeBase;
    var isAndroidAssets = bundleUrl.indexOf('file://assets/') >= 0;

    var isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0;
    if (isAndroidAssets) {
        nativeBase = 'file://assets/dist/';
    } else if (isiOSAssets) {
        nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1);
    } else {
        var host = getHostPort();
        var matches = /\/\/([^\/]+?)\//.exec(bundleUrl);
        console.log(matches);
        if (matches && matches.length >= 2) {
            host = matches[1];
        }
        console.log("host:" + host);
        //此处需注意一下,tabbar 用的直接是jsbundle 的路径,但是navigator是直接跳转到新页面上的.
        if ((typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) === 'object' && isnav) {
            nativeBase = 'http://' + host + '/index.html?page=./dist/';
        } else {
            nativeBase = 'http://' + host + '/' + rootpath + '/';
        }
    }

    return nativeBase;
}

exports.getBaseUrl = function (bundleUrl, isnav, images) {
    return getBaseUrl(bundleUrl, isnav, images);
};
exports.getImagesBaseUrl = function (config) {
    var bundleUrl = config.bundleUrl;
    var base = getBaseUrl(bundleUrl, false, 'images');
    return base;
};
exports.getBaseImg = function () {
    var baseImgUrl = apiURL.basisimg;
    return baseImgUrl;
};

function getHostPort() {
    // var hostname = typeof CURRENT_IP === 'string' ? CURRENT_IP : location.hostname
    // if (location) {
    //     var protocol = location.protocol + '//'
    //     var port = location.port ? ':' + location.port : ''
    //         //TODO
    //     port = ':8888'
    //     var url = protocol + hostname + port
    // } else {
    //     var url = 'http://' + hostname + ':8888'
    //     return url
    // }

    //生产地址
    // return 'www.awakenpay.com'

    //测试本机地址
    return '192.168.3.178:8888';
}
exports.getParameterByName = function (name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

function getBaseUrl(bundleUrl, isnav, images) {

    var rootpath = images;
    if (!rootpath) {
        rootpath = "dist";
        // rootpath = "merchant/dist"
    }
    bundleUrl = new String(bundleUrl);
    var nativeBase;
    var isAndroidAssets = bundleUrl.indexOf('file://assets/') >= 0;

    var isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0;
    if (isAndroidAssets) {
        nativeBase = 'file://assets/dist/';
    } else if (isiOSAssets) {
        nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1);
    } else {
        var host = getHostPort();
        var matches = /\/\/([^\/]+?)\//.exec(bundleUrl);
        console.log(matches);
        if (matches && matches.length >= 2) {
            host = matches[1];
        }
        console.log("host:" + host);
        //此处需注意一下,tabbar 用的直接是jsbundle 的路径,但是navigator是直接跳转到新页面上的.
        if ((typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) === 'object' && isnav) {
            nativeBase = 'http://' + host + '/index.html?page=./dist/';
        } else {
            nativeBase = 'http://' + host + '/' + rootpath + '/';
        }
    }

    return nativeBase;
}

exports.getBaseUrl = function (bundleUrl, isnav, images) {
    return getBaseUrl(bundleUrl, isnav, images);
};

function toParams(obj) {
    var param = "";
    for (var name in obj) {
        if (typeof obj[name] != 'function') {
            param += "&" + name + "=" + encodeURI(obj[name]);
        }
    }
    return param.substring(1);
}

function getData(url, callback) {
    var stream = weex.requireModule('stream');
    var modal = weex.requireModule('modal');
    stream.fetch({
        method: 'GET',
        url: url,
        type: 'json'
    }, function (ret) {
        if (!ret.ok) {
            modal.toast({ message: '网络有问题，连不上', duration: 1 });
            console.log("request failed");
        } else {
            callback(ret.data);
        }
    });
}

function postData(url, data, callback) {
    //comm.onLoadingStart();
    var stream = weex.requireModule('stream');
    var modal = weex.requireModule('modal');
    stream.fetch({
        method: 'POST',
        url: url,
        type: 'json',
        body: data,
        headers: { 'Content-Type': 'application/json' }
    }, function (ret) {
        if (!ret.ok) {
            modal.toast({ message: '网络有问题，连不上', duration: 1 });
            //modal.toast({ message: ret.status + ret.statusText, duration: 1 });
            console.log("request failed");
        } else {
            callback(ret.data);
        }
    });
}

//Banner列表
exports.requireBannerList = function (data, callback) {
    postData(apiURL.baseurl + 'api/content/list', data, callback);
};

//热门新闻
exports.requireHotNewsList = function (data, callback) {
    postData(apiURL.baseurl + 'api/news/hotnews', data, callback);
};

//聚合页面列表
exports.requireAlertFocusList = function (data, callback) {
    postData(apiURL.baseurl + 'api/member/list', data, callback);
};

//聚合页面简介
exports.requireAlertFocusDesc = function (data, callback) {
    postData(apiURL.baseurl + 'api/member/info', data, callback);
};

//新闻搜索
exports.requireSearchNews = function (data, callback) {
    postData(apiURL.baseurl + 'api/news/q', data, callback);
};

//关注
exports.requireFollow = function (data, callback) {
    postData(apiURL.baseurl + 'api/subscribe/subscribeMember', data, callback);
};

//关注列表
exports.requireFollowList = function (data, callback) {
    postData(apiURL.baseurl + 'api/subscribe/subscribeMemberList', data, callback);
};

//登录
exports.requireLogin = function (data, callback) {
    postData(apiURL.baseurl + 'api/user/login', data, callback);
};
//退出
exports.requireLogout = function (callback) {
    getData(apiURL.baseurl + 'api/user/logout', callback);
};
//发送验证码
exports.requireSignUpValidate = function (data, callback) {
    postData(apiURL.baseurl + 'api/user/signUpValidate', data, callback);
};
//注册
exports.requireSignUp = function (data, callback) {
    postData(apiURL.baseurl + 'api/user/signUp', data, callback);
};
//个人中心
exports.requireUserInfo = function (data, callback) {
    postData(apiURL.baseurl + 'api/user/info', data, callback);
};
//发送修改密码验证码
exports.requireSendModifyPwdCode = function (data, callback) {
    postData(apiURL.baseurl + 'api/user/sendModifyPwdCode', data, callback);
};
//个人中心
exports.requireModifyPwd = function (data, callback) {
    postData(apiURL.baseurl + 'api/user/modifyPwd', data, callback);
};

//文章内容界面
exports.requireArticalContent = function (data, callback) {
    postData(apiURL.baseurl + 'api/news/viewNews', data, callback);
};
//文章内容界面
exports.requireCandyContent = function (data, callback) {
    postData(apiURL.baseurl + 'api/activity/view', data, callback);
};
//翻译
exports.requireTranslate = function (data, callback) {
    postData(apiURL.baseurl + 'api/news/translate', data, callback);
};
//修改用户名
exports.requireModifyInfo = function (data, callback) {
    postData(apiURL.baseurl + 'api/user/modifyInfo', data, callback);
};

//糖果 空投 注册邀请
exports.requireActivityList = function (data, callback) {
    postData(apiURL.baseurl + 'api/activity/list', data, callback);
};
//快速登录发送验证码
exports.requireFastLoginValidate = function (data, callback) {
    postData(apiURL.baseurl + 'api/user/sendSms', data, callback);
};
//快速登录发送验证码
exports.requireFastLogin = function (data, callback) {
    postData(apiURL.baseurl + 'api/user/phoneLogin', data, callback);
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _type = __webpack_require__(88);

var _utils = __webpack_require__(77);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    interval: {
      type: [Number, String],
      default: 0
    },
    needMask: {
      type: Boolean,
      default: false
    },
    maskStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      showLoading: false,
      tid: 0
    };
  },
  watch: {
    show: function show() {
      this.setShow();
    }
  },
  computed: {
    loading: function loading() {
      var loading = {};
      switch (this.type) {
        case 'trip':
          loading = {
            url: _type.GIF,
            class: 'trip-loading'
          };
          break;
        default:
          loading = {
            url: _type.BLACK_GIF,
            class: 'default-loading'
          };
      }
      return loading;
    },
    topPosition: function topPosition() {
      return (_utils2.default.env.getPageHeight() - 200) / 2;
    }
  },
  created: function created() {
    this.setShow();
  },

  methods: {
    maskClicked: function maskClicked() {
      this.needMask && this.$emit('wxcLoadingMaskClicked', {});
    },
    setShow: function setShow() {
      var _this = this;

      var interval = this.interval,
          show = this.show,
          showLoading = this.showLoading;

      var stInterval = parseInt(interval);
      clearTimeout(this.tid);
      if (show) {
        if (showLoading) {
          return;
        }
        if (stInterval === 0) {
          this.showLoading = true;
        } else {
          this.tid = setTimeout(function () {
            _this.showLoading = true;
          }, stInterval);
        }
      } else {
        this.showLoading = false;
      }
    }
  }
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(50);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(90);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(2).document;
module.exports = document && document.documentElement;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(19);
var createDesc = __webpack_require__(15);
var toIObject = __webpack_require__(10);
var toPrimitive = __webpack_require__(27);
var has = __webpack_require__(4);
var IE8_DOM_DEFINE = __webpack_require__(37);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(3) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(26);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {



/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(71)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(38)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(73);
var global = __webpack_require__(2);
var hide = __webpack_require__(8);
var Iterators = __webpack_require__(20);
var TO_STRING_TAG = __webpack_require__(7)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(59), __esModule: true };

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(60), __esModule: true };

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(74);
__webpack_require__(54);
__webpack_require__(75);
__webpack_require__(76);
module.exports = __webpack_require__(9).Symbol;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(55);
__webpack_require__(56);
module.exports = __webpack_require__(29).f('iterator');


/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(10);
var toLength = __webpack_require__(53);
var toAbsoluteIndex = __webpack_require__(72);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(18);
var gOPS = __webpack_require__(31);
var pIE = __webpack_require__(19);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(32);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(36);
var descriptor = __webpack_require__(15);
var setToStringTag = __webpack_require__(21);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(8)(IteratorPrototype, __webpack_require__(7)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(16)('meta');
var isObject = __webpack_require__(11);
var has = __webpack_require__(4);
var setDesc = __webpack_require__(5).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(12)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(5);
var anObject = __webpack_require__(13);
var getKeys = __webpack_require__(18);

module.exports = __webpack_require__(3) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(10);
var gOPN = __webpack_require__(39).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(4);
var toObject = __webpack_require__(43);
var IE_PROTO = __webpack_require__(24)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26);
var defined = __webpack_require__(22);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(61);
var step = __webpack_require__(66);
var Iterators = __webpack_require__(20);
var toIObject = __webpack_require__(10);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(38)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(2);
var has = __webpack_require__(4);
var DESCRIPTORS = __webpack_require__(3);
var $export = __webpack_require__(17);
var redefine = __webpack_require__(41);
var META = __webpack_require__(67).KEY;
var $fails = __webpack_require__(12);
var shared = __webpack_require__(25);
var setToStringTag = __webpack_require__(21);
var uid = __webpack_require__(16);
var wks = __webpack_require__(7);
var wksExt = __webpack_require__(29);
var wksDefine = __webpack_require__(28);
var enumKeys = __webpack_require__(63);
var isArray = __webpack_require__(64);
var anObject = __webpack_require__(13);
var isObject = __webpack_require__(11);
var toIObject = __webpack_require__(10);
var toPrimitive = __webpack_require__(27);
var createDesc = __webpack_require__(15);
var _create = __webpack_require__(36);
var gOPNExt = __webpack_require__(69);
var $GOPD = __webpack_require__(52);
var $DP = __webpack_require__(5);
var $keys = __webpack_require__(18);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(39).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(19).f = $propertyIsEnumerable;
  __webpack_require__(31).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(14)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(8)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('asyncIterator');


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('observable');


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = __webpack_require__(44);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof3 = __webpack_require__(30);

var _typeof4 = _interopRequireDefault(_typeof3);

var _urlParse = __webpack_require__(45);

var _urlParse2 = _interopRequireDefault(_urlParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Utils = {
  UrlParser: _urlParse2.default,
  _typeof: function _typeof(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  },
  isPlainObject: function isPlainObject(obj) {
    return Utils._typeof(obj) === 'object';
  },
  isString: function isString(obj) {
    return typeof obj === 'string';
  },
  isNonEmptyArray: function isNonEmptyArray() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return obj && obj.length > 0 && Array.isArray(obj) && typeof obj !== 'undefined';
  },
  isObject: function isObject(item) {
    return item && (typeof item === 'undefined' ? 'undefined' : (0, _typeof4.default)(item)) === 'object' && !Array.isArray(item);
  },
  isEmptyObject: function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  },
  decodeIconFont: function decodeIconFont(text) {
    // 正则匹配 图标和文字混排 eg: 我去上学校&#xe600;,天天不&#xe600;迟到
    var regExp = /&#x[a-z|0-9]{4,5};?/g;
    if (regExp.test(text)) {
      return text.replace(new RegExp(regExp, 'g'), function (iconText) {
        var replace = iconText.replace(/&#x/, '0x').replace(/;$/, '');
        return String.fromCharCode(replace);
      });
    } else {
      return text;
    }
  },
  mergeDeep: function mergeDeep(target) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    if (!sources.length) return target;
    var source = sources.shift();
    if (Utils.isObject(target) && Utils.isObject(source)) {
      for (var key in source) {
        if (Utils.isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, (0, _defineProperty3.default)({}, key, {}));
          }
          Utils.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, (0, _defineProperty3.default)({}, key, source[key]));
        }
      }
    }
    return Utils.mergeDeep.apply(Utils, [target].concat(sources));
  },
  appendProtocol: function appendProtocol(url) {
    if (/^\/\//.test(url)) {
      var bundleUrl = weex.config.bundleUrl;

      return 'http' + (/^https:/.test(bundleUrl) ? 's' : '') + ':' + url;
    }
    return url;
  },
  encodeURLParams: function encodeURLParams(url) {
    var parsedUrl = new _urlParse2.default(url, true);
    return parsedUrl.toString();
  },
  goToH5Page: function goToH5Page(jumpUrl) {
    var animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var Navigator = weex.requireModule('navigator');
    var jumpUrlObj = new Utils.UrlParser(jumpUrl, true);
    var url = Utils.appendProtocol(jumpUrlObj.toString());
    Navigator.push({
      url: Utils.encodeURLParams(url),
      animated: animated.toString()
    }, callback);
  },

  env: {
    isTaobao: function isTaobao() {
      var appName = weex.config.env.appName;

      return (/(tb|taobao|淘宝)/i.test(appName)
      );
    },
    isTrip: function isTrip() {
      var appName = weex.config.env.appName;

      return appName === 'LX';
    },
    isBoat: function isBoat() {
      var appName = weex.config.env.appName;

      return appName === 'Boat' || appName === 'BoatPlayground';
    },
    isWeb: function isWeb() {
      var platform = weex.config.env.platform;

      return (typeof window === 'undefined' ? 'undefined' : (0, _typeof4.default)(window)) === 'object' && platform.toLowerCase() === 'web';
    },
    isIOS: function isIOS() {
      var platform = weex.config.env.platform;

      return platform.toLowerCase() === 'ios';
    },

    /**
     * 是否为 iPhone X
     * @returns {boolean}
     */
    isIPhoneX: function isIPhoneX() {
      var deviceHeight = weex.config.env.deviceHeight;

      if (Utils.env.isWeb()) {
        return (typeof window === 'undefined' ? 'undefined' : (0, _typeof4.default)(window)) !== undefined && window.screen && window.screen.width && window.screen.height && parseInt(window.screen.width, 10) === 375 && parseInt(window.screen.height, 10) === 812;
      }
      return Utils.env.isIOS() && deviceHeight === 2436;
    },
    isAndroid: function isAndroid() {
      var platform = weex.config.env.platform;

      return platform.toLowerCase() === 'android';
    },
    isAlipay: function isAlipay() {
      var appName = weex.config.env.appName;

      return appName === 'AP';
    },
    isTmall: function isTmall() {
      var appName = weex.config.env.appName;

      return (/(tm|tmall|天猫)/i.test(appName)
      );
    },
    isAliWeex: function isAliWeex() {
      return Utils.env.isTmall() || Utils.env.isTrip() || Utils.env.isTaobao();
    },
    supportsEB: function supportsEB() {
      var weexVersion = weex.config.env.weexVersion || '0';
      var isHighWeex = Utils.compareVersion(weexVersion, '0.10.1.4') && (Utils.env.isIOS() || Utils.env.isAndroid());
      var expressionBinding = weex.requireModule('expressionBinding');
      return expressionBinding && expressionBinding.enableBinding && isHighWeex;
    },


    /**
     * 判断Android容器是否支持是否支持expressionBinding(处理方式很不一致)
     * @returns {boolean}
     */
    supportsEBForAndroid: function supportsEBForAndroid() {
      return Utils.env.isAndroid() && Utils.env.supportsEB();
    },


    /**
     * 判断IOS容器是否支持是否支持expressionBinding
     * @returns {boolean}
     */
    supportsEBForIos: function supportsEBForIos() {
      return Utils.env.isIOS() && Utils.env.supportsEB();
    },


    /**
     * 获取weex屏幕真实的设置高度，需要减去导航栏高度
     * @returns {Number}
     */
    getPageHeight: function getPageHeight() {
      var env = weex.config.env;

      var navHeight = Utils.env.isWeb() ? 0 : Utils.env.isIPhoneX() ? 176 : 132;
      return env.deviceHeight / env.deviceWidth * 750 - navHeight;
    },

    /**
     * 获取weex屏幕真实的设置高度
     * @returns {Number}
     */
    getScreenHeight: function getScreenHeight() {
      var env = weex.config.env;

      return env.deviceHeight / env.deviceWidth * 750;
    }
  },

  /**
   * 版本号比较
   * @memberOf Utils
   * @param currVer {string}
   * @param promoteVer {string}
   * @returns {boolean}
   * @example
   *
   * const { Utils } = require('@ali/wx-bridge');
   * const { compareVersion } = Utils;
   * console.log(compareVersion('0.1.100', '0.1.11')); // 'true'
   */
  compareVersion: function compareVersion() {
    var currVer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '0.0.0';
    var promoteVer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0.0.0';

    if (currVer === promoteVer) return true;
    var currVerArr = currVer.split('.');
    var promoteVerArr = promoteVer.split('.');
    var len = Math.max(currVerArr.length, promoteVerArr.length);
    for (var i = 0; i < len; i++) {
      var proVal = ~~promoteVerArr[i];
      var curVal = ~~currVerArr[i];
      if (proVal < curVal) {
        return true;
      } else if (proVal > curVal) {
        return false;
      }
    }
    return false;
  },

  /**
   * 分割数组
   * @param arr 被分割数组
   * @param size 分割数组的长度
   * @returns {Array}
   */
  arrayChunk: function arrayChunk() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

    var groups = [];
    if (arr && arr.length > 0) {
      groups = arr.map(function (e, i) {
        return i % size === 0 ? arr.slice(i, i + size) : null;
      }).filter(function (e) {
        return e;
      });
    }
    return groups;
  },
  truncateString: function truncateString(str, len) {
    var hasDot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var newLength = 0;
    var newStr = '';
    var singleChar = '';
    var chineseRegex = /[^\x00-\xff]/g;
    var strLength = str.replace(chineseRegex, '**').length;
    for (var i = 0; i < strLength; i++) {
      singleChar = str.charAt(i).toString();
      if (singleChar.match(chineseRegex) !== null) {
        newLength += 2;
      } else {
        newLength++;
      }
      if (newLength > len) {
        break;
      }
      newStr += singleChar;
    }

    if (hasDot && strLength > len) {
      newStr += '...';
    }
    return newStr;
  },

  animation: {
    /**
     * 返回定义页面转场动画起初的位置
     * @param ref
     * @param transform 运动类型
     * @param status
     * @param callback 回调函数
     */
    pageTransitionAnimation: function pageTransitionAnimation(ref, transform, status, callback) {
      var animation = weex.requireModule('animation');
      animation.transition(ref, {
        styles: {
          transform: transform
        },
        duration: status ? 250 : 300, // ms
        timingFunction: status ? 'ease-in' : 'ease-out',
        delay: 0 // ms
      }, function () {
        callback && callback();
      });
    }
  },
  uiStyle: {
    /**
     * 返回定义页面转场动画起初的位置
     * @param animationType 页面转场动画的类型 push，model
     * @param size 分割数组的长度
     * @returns {}
     */
    pageTransitionAnimationStyle: function pageTransitionAnimationStyle(animationType) {
      if (animationType === 'push') {
        return { left: '750px', top: '0px', height: weex.config.env.deviceHeight / weex.config.env.deviceWidth * 750 + 'px' };
      } else if (animationType === 'model') {
        return { top: weex.config.env.deviceHeight / weex.config.env.deviceWidth * 750 + 'px', left: '0px', height: weex.config.env.deviceHeight / weex.config.env.deviceWidth * 750 + 'px' };
      }
      return {};
    }
  }
}; /**
    * CopyRight (C) 2017-2022 Alibaba Group Holding Limited.
    * Created by Tw93 on 17/11/01
    */

exports.default = Utils;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(79), __esModule: true };

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(80);
var $Object = __webpack_require__(9).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(17);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(3), 'Object', { defineProperty: __webpack_require__(5).f });


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(86);

var _extends3 = _interopRequireDefault(_extends2);

var _type = __webpack_require__(102);

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dom = weex.requireModule('dom'); //
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  props: {
    name: {
      default: 'success',
      type: String
    },
    size: {
      default: 'small',
      type: String
    },
    iconStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      Icon: _type2.default
    };
  },
  beforeCreate: function beforeCreate() {
    dom.addRule('fontFace', {
      'fontFamily': "weexUiIconFont",
      'src': "url('//at.alicdn.com/t/font_520368_r89ekv69euahsemi.ttf')"
    });
  },

  computed: {
    mergeStyle: function mergeStyle() {
      var iconStyle = this.iconStyle,
          size = this.size;

      var fontSize = '48px';
      switch (size) {
        case 'xs':
          fontSize = '24px';
          break;
        case 'small':
          fontSize = '48px';
          break;
        case 'medium':
          fontSize = '72px';
          break;
        case 'big':
          fontSize = '128px';
          break;
        default:
          fontSize = '48px';
      }
      return (0, _extends3.default)({
        fontFamily: 'weexUiIconFont',
        fontSize: fontSize
      }, iconStyle);
    }
  },
  methods: {
    itemClicked: function itemClicked(name) {
      this.$emit('wxcIconClicked', {
        name: name
      });
    }
  }
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcIcon = __webpack_require__(101);

var _wxcIcon2 = _interopRequireDefault(_wxcIcon);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
exports.default = {
    components: { WxcIcon: _wxcIcon2.default },
    props: ["data"],
    data: function data() {
        return {};
    },
    created: function created() {},

    computed: {
        isIPhoneX: function isIPhoneX() {
            return _util2.default.env.isIPhoneX();
        }
    },
    methods: {
        closeBack: function closeBack() {
            //  modal.toast({ message:this.data.title});
            if (this.data.title == '登录' || this.data.title == '修改用户名' || this.data.title == '修改密码' || this.data.title == '快速登录') {
                if (event.dismissViewController("") != undefined) {
                    event.dismissViewController("");
                }
            } else {
                this.jumpBack();
            }
        }
    }
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encodeURIComponent(key);
      value = encodeURIComponent(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),
/* 85 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(95);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
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

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginHeader_vue__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginHeader_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginHeader_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginHeader_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginHeader_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7c9edd49_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_loginHeader_vue__ = __webpack_require__(107);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(109)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7c9edd49"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginHeader_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7c9edd49_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_loginHeader_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/login/loginHeader.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7c9edd49", Component.options)
  } else {
    hotAPI.reload("data-v-7c9edd49", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by Tw93 on 2016/10/29.
 */

var GIF = exports.GIF = 'https://img.alicdn.com/tfs/TB1aks3PpXXXXcXXFXXXXXXXXXX-150-150.gif';
var BLACK_GIF = exports.BLACK_GIF = 'https://img.alicdn.com/tfs/TB1Ep_9NVXXXXb8XVXXXXXXXXXX-74-74.gif';
var PART = exports.PART = 'https://gtms02.alicdn.com/tfs/TB1y4QbSXXXXXbgapXXXXXXXXXX-50-50.gif';

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.loading-need-mask[data-v-7a7a2208] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(0, 0, 0, 0.2);\n}\n.wxc-loading[data-v-7a7a2208] {\n  position: fixed;\n  left: 287px;\n  top: 500px;\n  z-index: 9999;\n}\n.loading-box[data-v-7a7a2208] {\n  align-items: center;\n  justify-content: center;\n  border-radius: 20px;\n  width: 175px;\n  height: 175px;\n  background-color: rgba(0, 0, 0, 0.8);\n}\n.trip-loading[data-v-7a7a2208] {\n  background-color: rgba(0, 0, 0, .2);\n}\n.loading-trip-image[data-v-7a7a2208] {\n  height: 75px;\n  width: 75px;\n}\n.loading-text[data-v-7a7a2208] {\n  color: #ffffff;\n  font-size: 24px;\n  line-height: 30px;\n  height: 30px;\n  margin-top: 8px;\n  text-overflow: ellipsis;\n  width: 140px;\n  text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_7a7a2208_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(91);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(92)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7a7a2208"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_7a7a2208_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/weex-ui/packages/wxc-loading/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7a7a2208", Component.options)
  } else {
    hotAPI.reload("data-v-7a7a2208", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      class: [_vm.showLoading && _vm.needMask && "loading-need-mask"],
      style: _vm.maskStyle,
      on: { click: _vm.maskClicked }
    },
    [
      _vm.showLoading
        ? _c(
            "div",
            {
              staticClass: "wxc-loading",
              style: { top: _vm.topPosition + "px" }
            },
            [
              _c(
                "div",
                {
                  class: ["loading-box", _vm.loading.class],
                  attrs: { "aria-hidden": true }
                },
                [
                  _c("image", {
                    staticClass: "loading-trip-image",
                    attrs: {
                      src: _vm.loading.url,
                      resize: "contain",
                      quality: "original"
                    }
                  }),
                  _vm._v(" "),
                  _vm.loadingText
                    ? _c("text", { staticClass: "loading-text" }, [
                        _vm._v(_vm._s(_vm.loadingText))
                      ])
                    : _vm._e()
                ]
              )
            ]
          )
        : _vm._e()
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7a7a2208", esExports)
  }
}

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(89);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("d78ab360", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a7a2208\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a7a2208\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(86);

var _extends3 = _interopRequireDefault(_extends2);

var _type = __webpack_require__(112);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  props: {
    text: {
      type: String,
      default: '确认'
    },
    type: {
      type: String,
      default: 'red'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    btnStyle: Object,
    textStyle: Object
  },
  computed: {
    mrBtnStyle: function mrBtnStyle() {
      var type = this.type,
          disabled = this.disabled,
          btnStyle = this.btnStyle;

      var mrBtnStyle = (0, _extends3.default)({}, _type.STYLE_MAP[type], btnStyle);
      return disabled ? (0, _extends3.default)({}, mrBtnStyle, {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 0
      }) : mrBtnStyle;
    },
    mrTextStyle: function mrTextStyle() {
      var type = this.type,
          disabled = this.disabled,
          textStyle = this.textStyle;

      var mrTextStyle = (0, _extends3.default)({}, _type.TEXT_STYLE_MAP[type], textStyle);
      return disabled ? (0, _extends3.default)({}, mrTextStyle, { color: '#FFFFFF' }) : mrTextStyle;
    }
  },
  methods: {
    onClicked: function onClicked(e) {
      var type = this.type,
          disabled = this.disabled;

      this.$emit('wxcButtonClicked', { e: e, type: type, disabled: disabled });
    }
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(114);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(96), __esModule: true };

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(98);
module.exports = __webpack_require__(9).Object.assign;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(18);
var gOPS = __webpack_require__(31);
var pIE = __webpack_require__(19);
var toObject = __webpack_require__(43);
var IObject = __webpack_require__(42);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(12)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(17);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(97) });


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(77);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  props: {
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    hasTopBorder: {
      type: Boolean,
      default: false
    },
    hasMargin: {
      type: Boolean,
      default: false
    },
    hasBottomBorder: {
      type: Boolean,
      default: true
    },
    hasArrow: {
      type: Boolean,
      default: false
    },
    arrowIcon: {
      type: String,
      default: 'https://gw.alicdn.com/tfs/TB11zBUpwMPMeJjy1XbXXcwxVXa-22-22.png'
    },
    hasVerticalIndent: {
      type: Boolean,
      default: true
    },
    cellStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    autoAccessible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    cellClicked: function cellClicked(e) {
      var link = this.link;
      this.$emit('wxcCellClicked', { e: e });
      link && _utils2.default.goToH5Page(link, true);
    }
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//


exports.default = {
    data: function data() {
        return {};
    },
    created: function created() {},

    methods: {}
};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(105);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  less: '\uE6A5',
  'more_unfold': '\uE6A6',
  back: '\uE697',
  more: '\uE6A7',
  add: '\uE6B9',
  subtract: '\uE6FE',
  close: '\uE69A',
  cry: '\uE69C',
  delete: '\uE69D',
  help: '\uE6A3',
  refresh: '\uE6AA',
  search: '\uE6AC',
  success: '\uE6B1',
  warning: '\uE6B6',
  wrong: '\uE6B7',
  clock: '\uE6BB',
  scanning: '\uE6EC',
  filter: '\uE6F1',
  map: '\uE715',
  play: '\uE719'
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.icon-font[data-v-37129143] {\n  color: #666666;\n}\n", ""]);

// exports


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.login_header[data-v-7c9edd49]{\n    margin-top: 70px;\n}\n.ipx_login_header[data-v-7c9edd49]{\n    margin-top: 120px;\n}\n.close_out[data-v-7c9edd49]{\n    width: 750px;\n    height: 60px;\n    flex-direction: row;\n    align-items: center;\n    justify-content: center;\n    margin-top: 50px;\n    background-color:white;\n}\n.login_text[data-v-7c9edd49]{\n    font-size: 35px\n}\n.close_content[data-v-7c9edd49]{\n    position: absolute;\n    left: 40px;\n    width: 60px;\n    height: 60px;\n}\n", ""]);

// exports


/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_37129143_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(106);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(108)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-37129143"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_37129143_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/weex-ui/packages/wxc-icon/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-37129143", Component.options)
  } else {
    hotAPI.reload("data-v-37129143", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "text",
    {
      staticClass: "icon-font",
      style: _vm.mergeStyle,
      on: {
        click: function($event) {
          return _vm.itemClicked(_vm.name)
        }
      }
    },
    [_vm._v(_vm._s(_vm.Icon[_vm.name]))]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-37129143", esExports)
  }
}

/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "close_out",
      class: [_vm.isIPhoneX ? "ipx_login_header" : "login_header"]
    },
    [
      _c("image", {
        staticClass: "close_content",
        attrs: { resize: "cover", src: _vm.get_img_path("wx_close.png") },
        on: {
          click: function($event) {
            return _vm.closeBack()
          }
        }
      }),
      _vm._v(" "),
      _c("div", { staticClass: "login_title" }, [
        _c("text", { staticClass: "login_text color1" }, [
          _vm._v(_vm._s(_vm.data.title))
        ])
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7c9edd49", esExports)
  }
}

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(103);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("6e0744c1", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-37129143\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-37129143\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(104);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("3523ea1c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7c9edd49\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./loginHeader.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7c9edd49\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./loginHeader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(119);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pcenterHeader_vue__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pcenterHeader_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pcenterHeader_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pcenterHeader_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pcenterHeader_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_212cf701_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pcenterHeader_vue__ = __webpack_require__(120);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(122)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-212cf701"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pcenterHeader_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_212cf701_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pcenterHeader_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/pcenter/pcenterHeader.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-212cf701", Component.options)
  } else {
    hotAPI.reload("data-v-212cf701", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var STYLE_MAP = exports.STYLE_MAP = {
  red: {
    backgroundColor: '#FF5000'
  },
  yellow: {
    backgroundColor: '#FFC900'
  },
  normal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#A5A5A5',
    borderWidth: '1px'
  },
  highlight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EE9900',
    borderWidth: '1px'
  }
};

var TEXT_STYLE_MAP = exports.TEXT_STYLE_MAP = {
  taobao: {
    color: '#FFFFFF'
  },
  fliggy: {
    color: '#3D3D3D'
  },
  normal: {
    color: '#3D3D3D'
  },
  highlight: {
    color: '#EE9900'
  }
};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.wxc-btn[data-v-6273a8fc] {\n  width: 702px;\n  height: 88px;\n  align-items: center;\n  justify-content: center;\n  border-radius: 12px;\n}\n.btn-text[data-v-6273a8fc] {\n  text-overflow: ellipsis;\n  lines: 1;\n  font-size: 36px;\n  color: #ffffff;\n}\n", ""]);

// exports


/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_6273a8fc_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(115);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(116)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6273a8fc"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_6273a8fc_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/weex-ui/packages/wxc-button/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6273a8fc", Component.options)
  } else {
    hotAPI.reload("data-v-6273a8fc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "wxc-btn",
      style: _vm.mrBtnStyle,
      attrs: { accessible: true, "aria-label": _vm.text },
      on: { click: _vm.onClicked }
    },
    [
      _c("text", { staticClass: "btn-text", style: _vm.mrTextStyle }, [
        _vm._v(_vm._s(_vm.text))
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6273a8fc", esExports)
  }
}

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(113);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("df465aac", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6273a8fc\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6273a8fc\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.wxc-cell[data-v-eff0e228] {\n  height: 100px;\n  flex-direction: row;\n  align-items: center;\n  padding-left: 24px;\n  padding-right: 24px;\n  background-color: #ffffff;\n}\n.cell-margin[data-v-eff0e228] {\n  margin-bottom: 24px;\n}\n.cell-title[data-v-eff0e228] {\n  flex: 1;\n}\n.cell-indent[data-v-eff0e228] {\n  padding-bottom: 30px;\n  padding-top: 30px;\n}\n.has-desc[data-v-eff0e228] {\n  padding-bottom: 18px;\n  padding-top: 18px;\n}\n.cell-top-border[data-v-eff0e228] {\n  border-top-color: #e2e2e2;\n  border-top-width: 1px;\n}\n.cell-bottom-border[data-v-eff0e228] {\n  border-bottom-color: #e2e2e2;\n  border-bottom-width: 1px;\n}\n.cell-label-text[data-v-eff0e228] {\n  font-size: 30px;\n  color: #666666;\n  width: 188px;\n  margin-right: 10px;\n}\n.cell-arrow-icon[data-v-eff0e228] {\n  width: 22px;\n  height: 22px;\n}\n.cell-content[data-v-eff0e228] {\n  color: #333333;\n  font-size: 30px;\n  line-height: 40px;\n}\n.cell-desc-text[data-v-eff0e228] {\n  color: #999999;\n  font-size: 24px;\n  line-height: 30px;\n  margin-top: 4px;\n}\n", ""]);

// exports


/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_eff0e228_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(121);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(123)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-eff0e228"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_eff0e228_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/weex-ui/packages/wxc-cell/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-eff0e228", Component.options)
  } else {
    hotAPI.reload("data-v-eff0e228", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {})
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-212cf701", esExports)
  }
}

/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      class: [
        "wxc-cell",
        _vm.hasTopBorder && "cell-top-border",
        _vm.hasBottomBorder && "cell-bottom-border",
        _vm.hasMargin && "cell-margin",
        _vm.hasVerticalIndent && "cell-indent",
        _vm.desc && "has-desc"
      ],
      style: _vm.cellStyle,
      attrs: {
        accessible: _vm.autoAccessible,
        "aria-label": _vm.label + "," + _vm.title + "," + _vm.desc
      },
      on: { click: _vm.cellClicked }
    },
    [
      _vm._t("label", [
        _vm.label
          ? _c("div", [
              _c("text", { staticClass: "cell-label-text" }, [
                _vm._v(_vm._s(_vm.label))
              ])
            ])
          : _vm._e()
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "cell-title" },
        [
          _vm._t("title", [
            _c("text", { staticClass: "cell-content" }, [
              _vm._v(_vm._s(_vm.title))
            ]),
            _vm._v(" "),
            _vm.desc
              ? _c("text", { staticClass: "cell-desc-text" }, [
                  _vm._v(_vm._s(_vm.desc))
                ])
              : _vm._e()
          ])
        ],
        2
      ),
      _vm._v(" "),
      _vm._t("value"),
      _vm._v(" "),
      _vm._t("default"),
      _vm._v(" "),
      _vm.hasArrow
        ? _c("image", {
            staticClass: "cell-arrow-icon",
            attrs: { src: _vm.arrowIcon, "aria-hidden": true }
          })
        : _vm._e()
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-eff0e228", esExports)
  }
}

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(117);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("365f8833", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-212cf701\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./pcenterHeader.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-212cf701\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./pcenterHeader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(118);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("573c4eac", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-eff0e228\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-eff0e228\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var Navigator = weex.requireModule('navigator');
exports.default = {
  props: {
    backgroundColor: {
      type: String,
      default: '#FFC900'
    },
    leftButton: {
      type: String,
      default: 'https://gw.alicdn.com/tfs/TB1x18VpwMPMeJjy1XdXXasrXXa-21-36.png'
    },
    textColor: {
      type: String,
      default: '#3D3D3D'
    },
    rightButton: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '标题'
    },
    leftText: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    },
    useDefaultReturn: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    leftButtonClicked: function leftButtonClicked() {
      var self = this;
      if (self.useDefaultReturn) {
        Navigator.pop({}, function (e) {});
      }
      self.$emit('wxcMinibarLeftButtonClicked', {});
    },
    rightButtonClicked: function rightButtonClicked() {
      var self = this;
      if (self.rightText || self.rightButton) {
        self.$emit('wxcMinibarRightButtonClicked', {});
      }
    }
  }
};

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(129);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    data: function data() {
        return {};
    },
    created: function created() {},

    methods: {}
};

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


exports.default = {
    data: function data() {
        return {};
    },
    created: function created() {},

    methods: {}
};

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.wxc-minibar[data-v-112985b0] {\n  width: 750px;\n  height: 90px;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  background-color: #009ff0;\n}\n.left[data-v-112985b0] {\n  width: 180px;\n  padding-left: 32px;\n}\n.middle-title[data-v-112985b0] {\n  font-size: 30px;\n  color: #ffffff;\n  height: 36px;\n  line-height: 34px;\n}\n.right[data-v-112985b0] {\n  width: 180px;\n  padding-right: 32px;\n  align-items: flex-end;\n}\n.left-button[data-v-112985b0] {\n  width: 21px;\n  height: 36px;\n}\n.right-button[data-v-112985b0] {\n  width: 32px;\n  height: 32px;\n}\n.icon-text[data-v-112985b0] {\n  font-size: 28px;\n  color: #ffffff;\n}\n", ""]);

// exports


/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_112985b0_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(130);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(131)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-112985b0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_112985b0_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/weex-ui/packages/wxc-minibar/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-112985b0", Component.options)
  } else {
    hotAPI.reload("data-v-112985b0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.show
    ? _c(
        "div",
        {
          staticClass: "wxc-minibar",
          style: { backgroundColor: _vm.backgroundColor }
        },
        [
          _c(
            "div",
            {
              staticClass: "left",
              attrs: { "aria-label": "返回", accessible: true },
              on: { click: _vm.leftButtonClicked }
            },
            [
              _vm._t("left", [
                _vm.leftButton && !_vm.leftText
                  ? _c("image", {
                      staticClass: "left-button",
                      attrs: { src: _vm.leftButton }
                    })
                  : _vm._e(),
                _vm._v(" "),
                _vm.leftText
                  ? _c(
                      "text",
                      {
                        staticClass: "icon-text",
                        style: { color: _vm.textColor }
                      },
                      [_vm._v(_vm._s(_vm.leftText))]
                    )
                  : _vm._e()
              ])
            ],
            2
          ),
          _vm._v(" "),
          _vm._t("middle", [
            _c(
              "text",
              { staticClass: "middle-title", style: { color: _vm.textColor } },
              [_vm._v(_vm._s(_vm.title))]
            )
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "right", on: { click: _vm.rightButtonClicked } },
            [
              _vm._t("right", [
                _vm.rightButton && !_vm.rightText
                  ? _c("image", {
                      staticClass: "right-button",
                      attrs: { src: _vm.rightButton, "aria-hidden": true }
                    })
                  : _vm._e(),
                _vm._v(" "),
                _vm.rightText
                  ? _c(
                      "text",
                      {
                        staticClass: "icon-text",
                        style: { color: _vm.textColor }
                      },
                      [_vm._v(_vm._s(_vm.rightText))]
                    )
                  : _vm._e()
              ])
            ],
            2
          )
        ],
        2
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-112985b0", esExports)
  }
}

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(128);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a9e35e4c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-112985b0\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-112985b0\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var CART_ICON = exports.CART_ICON = 'https://gw.alicdn.com/tfs/TB1HrvtbBTH8KJjy0FiXXcRsXXa-32-32.png';
var RETURN_ICON = exports.RETURN_ICON = 'https://gw.alicdn.com/tfs/TB1cAYsbv2H8KJjy0FcXXaDlFXa-30-53.png';

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.isstartwith = function (str, prefix) {
    var index = str.indexOf(prefix);
    console.log('startIndex:' + index);
    return index == 0; //index为0则表明str以prefix开头;若不包含prefix则index为-1
};
exports.isendwith = function (str, suffix) {
    var index = str.indexOf(suffix);
    console.log('endIndex:' + index);
    return index == str.length - suffix.length;
};

exports.showFormat = function (millsecords, format) {
    if (!format) {
        format = "yyyy-MM-dd HH:mm:ss";
    }
    return new Date(millsecords).pattern(format);
};

/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2d6f70d4_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__ = __webpack_require__(157);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(159)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2d6f70d4"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2d6f70d4_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/home/header.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2d6f70d4", Component.options)
  } else {
    hotAPI.reload("data-v-2d6f70d4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 135 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserHeader_vue__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserHeader_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserHeader_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserHeader_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserHeader_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c1186616_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_UserHeader_vue__ = __webpack_require__(158);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(160)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-c1186616"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserHeader_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c1186616_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_UserHeader_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/user/UserHeader.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c1186616", Component.options)
  } else {
    hotAPI.reload("data-v-c1186616", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = __webpack_require__(30);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var animation = weex.requireModule('animation');
var platform = weex.config.env.platform;

var isWeb = (typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) === 'object' && platform.toLowerCase() === 'web';

exports.default = {
  props: {
    buttons: Array,
    position: Object,
    arrowPosition: Object,
    coverColor: String
  },
  data: function data() {
    return {
      show: false
    };
  },
  computed: {
    coverStyle: function coverStyle() {
      return this.coverColor ? { backgroundColor: this.coverColor } : '';
    },
    contentStyle: function contentStyle() {
      var _position = this.position,
          _position$x = _position.x,
          x = _position$x === undefined ? 0 : _position$x,
          _position$y = _position.y,
          y = _position$y === undefined ? 0 : _position$y,
          style = {};

      x < 0 ? style.right = -x + 'px' : style.left = x + 'px';
      y < 0 ? style.bottom = -y + 'px' : style.top = y + 'px';
      return style;
    },
    arrowStyle: function arrowStyle() {
      var _arrowPosition = this.arrowPosition,
          _arrowPosition$pos = _arrowPosition.pos,
          pos = _arrowPosition$pos === undefined ? 'top' : _arrowPosition$pos,
          _arrowPosition$x = _arrowPosition.x,
          x = _arrowPosition$x === undefined ? 0 : _arrowPosition$x,
          _arrowPosition$y = _arrowPosition.y,
          y = _arrowPosition$y === undefined ? 0 : _arrowPosition$y,
          style = {};

      switch (pos) {
        case 'top':
          style.top = '-8px';
        case 'bottom':
          !style.top && (style.bottom = '-8px');
          style.transform = 'scaleX(0.8) rotate(45deg)';
          x < 0 ? style.right = -x + 'px' : style.left = x + 'px';
          break;
        case 'left':
          style.left = '-8px';
        case 'right':
          !style.left && (style.right = '-8px');
          style.transform = 'scaleY(0.8) rotate(45deg)';
          y < 0 ? style.bottom = -y + 'px' : style.top = y + 'px';
          break;
        default:
          break;
      }
      return style;
    }
  },
  methods: {
    wxcPopoverShow: function wxcPopoverShow() {
      this.show = true;
    },
    wxcOverlayBodyClicked: function wxcOverlayBodyClicked() {
      this.show = false;
    },
    wxcButtonClicked: function wxcButtonClicked(index, key) {
      this.$emit('wxcPopoverButtonClicked', { key: key, index: index });
      this.show = false;
    }
  }
};

/***/ }),
/* 137 */,
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var modal = weex.requireModule('modal');
exports.default = {
    computed: {},
    data: function data() {
        return {
            pIndexKey: 'home'
        };
    },
    mounted: function mounted() {},

    methods: {
        isActive: function isActive(_c) {
            return this.pIndexKey === _c ? 'bar-active' : '';
        },
        tabTo: function tabTo(_key) {
            if (this.pIndexKey === _key) return;
            this.pIndexKey = _key;
            this.$emit('tabTo', {
                status: 'tabTo',
                data: {
                    key: _key
                }
            });
        }
    }
};

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _header = __webpack_require__(134);

var _header2 = _interopRequireDefault(_header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    components: {
        'home-header': _header2.default
    },
    data: function data() {
        return {
            YXBanners: [],
            goodsList: [],
            showLoading: 'hide'
        };
    },
    created: function created() {},

    methods: {}
}; //
//
//
//
//
//
//

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wxcMinibar = __webpack_require__(125);

var _wxcMinibar2 = _interopRequireDefault(_wxcMinibar);

var _type = __webpack_require__(132);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var stream = weex.requireModule('stream') || {};

var apis = __webpack_require__(46);
var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
exports.default = {
  data: function data() {
    return {
      leftButton: _type.RETURN_ICON,
      posts: [],
      loading: true
    };
  },
  components: { WxcMinibar: _wxcMinibar2.default },
  created: function created() {
    var self = this;
    apis.requireBannerList({
      "category": "appIndexTop"
    }, function (res) {
      self.isShowLoad = false;
      if (res.respond.ok) {
        self.posts = res.data.ads;
      } else {
        modal.toast({ message: res.respond.msg, duration: 1 });
      }
    });
    // stream.fetch({
    //   method: 'GET',
    //   url: API,
    //   type:'json'
    // }, function(ret) {
    //   if(!ret.ok){
    //     modal.toast({
    //       message: 'Network Error!',
    //       duration: 3
    //     });
    //   }else{
    //     self.posts = self.posts.concat(ret.data.results);
    //   }
    // });
  },
  methods: {
    onload: function onload(e) {},
    goAboutUs: function goAboutUs() {
      event.openURL("index.js?#/aboutUs", "关于我们", "push");
    },
    minibarLeftButtonClick: function minibarLeftButtonClick() {},
    minibarRightButtonClick: function minibarRightButtonClick() {
      modal.toast({ 'message': 'click rightButton!', 'duration': 1 });
    }
  }
};

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcButton = __webpack_require__(94);

var _wxcButton2 = _interopRequireDefault(_wxcButton);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _loginHeader = __webpack_require__(87);

var _loginHeader2 = _interopRequireDefault(_loginHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var apis = __webpack_require__(46);
var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, WxcButton: _wxcButton2.default, loginHeader: _loginHeader2.default },
    data: function data() {
        return {
            fontSize: '15px',
            color: '#292b32',
            mobileNo: '',
            vCode: '',
            data: { title: "快速登录" },
            isShowLoad: false,
            interval: 0,
            type: 'default',
            loadingText: '加载中',
            datatime: {
                time: 60,
                timetext: '发送验证码',
                judgetime: true
            },
            vcodeFocus: false
        };
    },
    computed: {
        textStyle: function textStyle() {
            var fontSize = this.fontSize,
                color = this.color;

            var customStyle = {};
            if (fontSize) {
                customStyle.fontSize = fontSize;
            }
            if (color) {
                customStyle.color = color;
            }
            return {
                fontSize: fontSize, color: color
            };
        }
    },
    created: function created() {
        if (this.$route.query.title != undefined) {
            this.data.title = this.$route.query.title;
        }
    },

    methods: {
        /*发送验证码*/
        sendCode: function sendCode() {
            var self = this;
            if (this.mobileNo.length < 1) {
                modal.toast({ message: '请输入手机号' });
                return;
            }
            var validationPhone = /^((\+?[0-9]{1,4})|(\(\+86\)))?(13|14|15|17|18)\d{9}$/;
            if (!validationPhone.test(this.mobileNo)) {
                modal.toast({ message: '手机号格式有误' });
                return false;
            }

            if (self.datatime.judgetime) {
                self.isShowLoad = true;
                apis.requireFastLoginValidate({
                    "data": self.mobileNo
                }, function (res) {
                    self.isShowLoad = false;
                    if (res.respond.ok) {
                        //验证码输入框自动获取焦点
                        self.vcodeFocus = true;
                        self.datatime.judgetime = false;
                        self.datatime.timetext = '60秒';
                        var timer = setInterval(function () {
                            self.datatime.time = self.datatime.time - 1;
                            if (self.datatime.time > 0) {
                                if ((self.datatime.time + '').length != 1) {
                                    self.datatime.timetext = self.datatime.time + '秒';
                                } else {
                                    self.datatime.timetext = '0' + self.datatime.time + '秒';
                                }
                            } else {
                                self.datatime.judgetime = true;
                                clearInterval(timer);
                                self.datatime.timetext = '重新发送';
                                self.datatime.time = 60;
                            }
                        }, 1000);
                    } else {
                        modal.toast({ message: res.respond.msg, duration: 1 });
                    }
                });
            }
        },
        /*进入设置密码页面*/
        goModifyPwd: function goModifyPwd() {
            var self = this;
            if (this.mobileNo.length < 1) {
                modal.toast({ message: '请输入手机号' });
                return;
            }
            var validationPhone = /^((\+?[0-9]{1,4})|(\(\+86\)))?(13|14|15|17|18)\d{9}$/;
            if (!validationPhone.test(this.mobileNo)) {
                modal.toast({ message: '手机号格式有误' });
                return false;
            }
            if (this.vCode.length < 1) {
                modal.toast({ message: '请输入验证码' });
                return;
            }
            self.isShowLoad = true;
            apis.requireFastLogin({
                "phone": self.mobileNo,
                "code": self.vCode

            }, function (res) {
                self.isShowLoad = false;
                if (res.respond.ok) {
                    modal.toast({ message: '登录成功', duration: 0.5 });
                    event.isLoginGlobalEvent("login", true);
                    event.dismissViewController("");
                } else {
                    modal.toast({ message: res.respond.msg, duration: 1 });
                }
            });
        }
    }
};

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcButton = __webpack_require__(94);

var _wxcButton2 = _interopRequireDefault(_wxcButton);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _loginHeader = __webpack_require__(87);

var _loginHeader2 = _interopRequireDefault(_loginHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var apis = __webpack_require__(46);
var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, loginHeader: _loginHeader2.default, WxcButton: _wxcButton2.default },
    data: function data() {
        return {
            fontSize: '15px',
            color: '#292b32',
            userNumber: '',
            userPassword: '',
            data: { title: "登录" },
            isshow: false,
            isShowLoad: false,
            loginData: {},
            interval: 0,
            type: 'default',
            loadingText: '加载中'
        };
    },
    computed: {
        textStyle: function textStyle() {
            var fontSize = this.fontSize,
                color = this.color;

            var customStyle = {};
            if (fontSize) {
                customStyle.fontSize = fontSize;
            }
            if (color) {
                customStyle.color = color;
            }
            return {
                fontSize: fontSize, color: color
            };
        },
        isIPhoneX: function isIPhoneX() {
            return _util2.default.env.isIPhoneX();
        },
        user: function user() {
            return { userId: "fengfeng", created: "20180215", karma: "xfjdllgmmdd", about: "42523252" };
        }
    },
    created: function created() {
        this.isshow = true;
    },
    mounted: function mounted() {},

    methods: {
        isAndroid: function isAndroid() {
            return _util2.default.env.isAndroid();
        },
        openLocalWebView: function openLocalWebView(url) {
            event.openWebView(url, "隐私权政策");
        },

        onchangeUserNumber: function onchangeUserNumber(event) {
            this.userNumber = event.value;
        },
        onchangeUserPassword: function onchangeUserPassword(event) {
            this.userPassword = event.value;
        },
        /*找回密码*/
        findPassword: function findPassword() {
            this.$router.push({ path: "/modifySendCode", query: { "title": "忘记密码" } });
        },
        openProtocol: function openProtocol() {
            this.$router.push({ path: "/loginDisclaimer", query: { "title": "免责申明" } });
        },
        /*注册*/
        register: function register() {
            this.$router.push({ path: '/home' });
            // this.$vm('toast').$emit('toast','Hello,注册暂时未开发，后续我们会进行完善。');  
        },
        //获取cookie
        getCookie: function getCookie(cname) {
            var name = cname + "=";
            var ca = weex.document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "";
        },
        /*处理登录*/
        login: function login() {
            var self = this;

            if (this.userNumber.length < 1) {
                modal.toast({ message: '请输入手机号' });
                return;
            } else if (this.userPassword.length < 1) {
                modal.toast({ message: '请输入密码' });
                return;
            }
            self.isShowLoad = true;
            apis.requireLogin({
                "account": self.userNumber,
                "password": self.userPassword

            }, function (res) {
                self.isShowLoad = false;
                if (res.respond.ok) {
                    modal.toast({ message: '登录成功', duration: 0.5 });
                    self.loginData = res.data;
                    event.isLoginGlobalEvent("login", true);
                    event.dismissViewController("");
                    //    modal.toast({message:weex.document.cookie,duration:1});
                    // console.log("ooo")
                    // console.log("ooo"+weex.document.cookie)
                    // //  self.getCookie("bb8_login_token");
                    // console.log("getCookie"+ self.getCookie("bb8_login_token"));
                    //  modal.toast({ message: self.getCookie("bb8_login_token")});
                    // if(event.dismissViewController("") != undefined){
                    //     event.isLoginGlobalEvent("login",true);
                    //     // event.dismissViewController("");

                    // }
                    console.log(res.data);
                } else {
                    modal.toast({ message: res.respond.msg, duration: 1 });
                }
            });
        }
    }
};

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcButton = __webpack_require__(94);

var _wxcButton2 = _interopRequireDefault(_wxcButton);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _loginHeader = __webpack_require__(87);

var _loginHeader2 = _interopRequireDefault(_loginHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var apis = __webpack_require__(46);
var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, WxcButton: _wxcButton2.default, loginHeader: _loginHeader2.default },
    data: function data() {
        return {
            fontSize: '15px',
            color: '#292b32',
            username: '',
            vCode: '',
            data: { title: "修改用户名" },
            isShowLoad: false,
            interval: 0,
            type: 'default',
            loadingText: '加载中'
        };
    },
    computed: {
        textStyle: function textStyle() {
            var fontSize = this.fontSize,
                color = this.color;

            var customStyle = {};
            if (fontSize) {
                customStyle.fontSize = fontSize;
            }
            if (color) {
                customStyle.color = color;
            }
            return {
                fontSize: fontSize, color: color
            };
        }
    },
    created: function created() {},

    methods: {
        /*修改信息*/
        modifyInfo: function modifyInfo() {
            var self = this;
            if (this.username.length < 1) {
                modal.toast({ message: '请输入用户名' });
                return;
            }
            var validationPhone = /^(?!_)(?!.*?_$)^(?!(\d+)$)[\u4e00-\u9fff\w]{3,12}$/;
            if (!validationPhone.test(this.username)) {
                modal.toast({ message: '用户名格式有误' });
                return false;
            }

            self.isShowLoad = true;
            apis.requireModifyInfo({
                "account": self.username
            }, function (res) {
                self.isShowLoad = false;
                if (res.respond.ok) {
                    modal.toast({ message: "修改成功", duration: 0.5 });
                    event.dismissViewController("");
                } else {
                    modal.toast({ message: res.respond.msg, duration: 1 });
                }
            });
        }

    }
};

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcButton = __webpack_require__(94);

var _wxcButton2 = _interopRequireDefault(_wxcButton);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _loginHeader = __webpack_require__(87);

var _loginHeader2 = _interopRequireDefault(_loginHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var apis = __webpack_require__(46);
var modal = weex.requireModule('modal');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, WxcButton: _wxcButton2.default, loginHeader: _loginHeader2.default },
    data: function data() {
        return {
            fontSize: '15px',
            color: '#292b32',
            userName: '',
            mobileNo: '',
            userPwd: '',
            nextUserPwd: '',
            vCode: '',
            data: { title: "登录密码设置" },
            isShowLoad: false,
            loginData: {},
            interval: 0,
            type: 'default',
            loadingText: '加载中'
        };
    },
    computed: {
        textStyle: function textStyle() {
            var fontSize = this.fontSize,
                color = this.color;

            var customStyle = {};
            if (fontSize) {
                customStyle.fontSize = fontSize;
            }
            if (color) {
                customStyle.color = color;
            }
            return {
                fontSize: fontSize, color: color
            };
        }
    },
    created: function created() {
        this.mobileNo = this.$route.query.mobileNo;
        this.vCode = this.$route.query.vCode;
    },

    methods: {
        /*修改密码*/
        getModifyPwd: function getModifyPwd() {
            var self = this;
            if (this.userPwd.length < 1) {
                modal.toast({ message: '请输入密码' });
                return;
            }
            var validationPwd = /^.{6,16}$/;
            if (!validationPwd.test(this.userPwd)) {
                modal.alert({
                    message: "密码：6~16个字符，区分大小写",
                    duration: 0.3,
                    okTitle: "确定"
                }, function (e) {});
                return false;
            }
            if (this.nextUserPwd != this.userPwd) {
                modal.toast({ message: '输入的2次密码不同' });
                return;
            }
            self.isShowLoad = true;
            apis.requireModifyPwd({
                "emailOrPhone": self.mobileNo,
                "password": self.userPwd,
                "confirmPassword": self.nextUserPwd,
                "validateCode": self.vCode
            }, function (res) {
                self.isShowLoad = false;
                if (res.respond.ok) {
                    modal.toast({ message: '设置成功', duration: 0.5 });
                    self.$router.push("/login");
                    // self.loginData = res.data;
                    console.log(res.data);
                } else {
                    modal.toast({ message: res.respond.msg, duration: 1 });
                }
            });
        }
    }
};

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcButton = __webpack_require__(94);

var _wxcButton2 = _interopRequireDefault(_wxcButton);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _loginHeader = __webpack_require__(87);

var _loginHeader2 = _interopRequireDefault(_loginHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var apis = __webpack_require__(46);
var modal = weex.requireModule('modal');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, WxcButton: _wxcButton2.default, loginHeader: _loginHeader2.default },
    data: function data() {
        return {
            fontSize: '15px',
            color: '#292b32',
            mobileNo: '',
            vCode: '',
            data: { title: "修改密码" },
            isShowLoad: false,
            interval: 0,
            type: 'default',
            loadingText: '加载中',
            datatime: {
                time: 60,
                timetext: '发送验证码',
                judgetime: true
            }
        };
    },
    computed: {
        textStyle: function textStyle() {
            var fontSize = this.fontSize,
                color = this.color;

            var customStyle = {};
            if (fontSize) {
                customStyle.fontSize = fontSize;
            }
            if (color) {
                customStyle.color = color;
            }
            return {
                fontSize: fontSize, color: color
            };
        }
    },
    created: function created() {
        if (this.$route.query.title != undefined) {
            this.data.title = this.$route.query.title;
        }
    },

    methods: {
        /*发送验证码*/
        sendCode: function sendCode() {
            var self = this;
            if (this.mobileNo.length < 1) {
                modal.toast({ message: '请输入手机号或邮箱' });
                return;
            }
            var validationPhone = /^((\+?[0-9]{1,4})|(\(\+86\)))?(13|14|15|17|18)\d{9}$/;
            var validationMail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if (!validationPhone.test(this.mobileNo) && !validationMail.test(this.mobileNo)) {
                modal.toast({ message: '手机号或邮箱格式有误' });
                return false;
            }

            if (self.datatime.judgetime) {
                self.isShowLoad = true;
                apis.requireSendModifyPwdCode({
                    "emailOrPhone": self.mobileNo
                }, function (res) {
                    self.isShowLoad = false;
                    if (res.respond.ok) {
                        self.datatime.judgetime = false;
                        self.datatime.timetext = '60秒';
                        var timer = setInterval(function () {
                            self.datatime.time = self.datatime.time - 1;
                            if (self.datatime.time > 0) {
                                if ((self.datatime.time + '').length != 1) {
                                    self.datatime.timetext = self.datatime.time + '秒';
                                } else {
                                    self.datatime.timetext = '0' + self.datatime.time + '秒';
                                }
                            } else {
                                self.datatime.judgetime = true;
                                clearInterval(timer);
                                self.datatime.timetext = '重新发送';
                                self.datatime.time = 60;
                            }
                        }, 1000);
                    } else {
                        modal.toast({ message: res.respond.msg, duration: 1 });
                    }
                });
            }
        },
        /*进入设置密码页面*/
        goModifyPwd: function goModifyPwd() {
            if (this.mobileNo.length < 1) {
                modal.toast({ message: '请输入手机号' });
                return;
            }
            var validationPhone = /^((\+?[0-9]{1,4})|(\(\+86\)))?(13|14|15|17|18)\d{9}$/;
            var validationMail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if (!validationPhone.test(this.mobileNo) && !validationMail.test(this.mobileNo)) {
                modal.toast({ message: '手机号或邮箱格式有误' });
                return false;
            }
            if (this.vCode.length < 1) {
                modal.toast({ message: '请输入验证码' });
                return;
            }
            if (this.$router) {
                this.$router.push({ path: "/modifyPwd", query: { "mobileNo": this.mobileNo, "vCode": this.vCode } });
            }
        }
    }
};

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcButton = __webpack_require__(94);

var _wxcButton2 = _interopRequireDefault(_wxcButton);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _loginHeader = __webpack_require__(87);

var _loginHeader2 = _interopRequireDefault(_loginHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var apis = __webpack_require__(46);
var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, WxcButton: _wxcButton2.default, loginHeader: _loginHeader2.default },
    data: function data() {
        return {
            fontSize: '15px',
            color: '#292b32',
            userName: '',
            mobileNo: '',
            userPwd: '',
            nextUserPwd: '',
            vCode: '',
            data: { title: "注册" },
            isShowLoad: false,
            loginData: {},
            interval: 0,
            type: 'default',
            loadingText: '加载中',
            datatime: {
                time: 60,
                timetext: '发送验证码',
                judgetime: true
            }
        };
    },
    computed: {
        textStyle: function textStyle() {
            var fontSize = this.fontSize,
                color = this.color;

            var customStyle = {};
            if (fontSize) {
                customStyle.fontSize = fontSize;
            }
            if (color) {
                customStyle.color = color;
            }
            return {
                fontSize: fontSize, color: color
            };
        },
        userId: function userId() {
            return 'fengfeng';
        },
        user: function user() {
            return { userId: "fengfeng", created: "20180215", karma: "xfjdllgmmdd", about: "42523252" };
        }
    },
    created: function created() {},

    methods: {
        onchangeUserNumber: function onchangeUserNumber(event) {},
        onchangeUserPassword: function onchangeUserPassword(event) {
            this.userPassword = event.value;
        },
        /*发送验证码*/
        sendCode: function sendCode() {
            var self = this;
            if (this.userName.length < 1) {
                modal.toast({ message: '请输入用户名' });
                return;
            }
            if (this.mobileNo.length < 1) {
                modal.toast({ message: '请输入手机号或邮箱' });
                return;
            }
            var validationName = /^(?!_)(?!.*?_$)^(?!(\d+)$)[\u4e00-\u9fff\w]{3,12}$/;
            if (!validationName.test(this.userName)) {

                modal.alert({
                    message: "用户名：3-12个字符 ，可使用汉字、字母、数字、下划线，不能为纯数字，且首末字符不能为下划线",
                    duration: 0.3,
                    okTitle: "确定"
                }, function (e) {});
                return false;
            }
            var validationPhone = /^((\+?[0-9]{1,4})|(\(\+86\)))?(13|14|15|17|18)\d{9}$/;
            var validationMail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if (!validationPhone.test(this.mobileNo) && !validationMail.test(this.mobileNo)) {
                modal.toast({ message: '手机号或邮箱格式有误' });
                return false;
            }
            if (this.userPwd.length < 1) {
                modal.toast({ message: '请输入密码' });
                return;
            }
            var validationPwd = /^.{6,16}$/;
            if (!validationPwd.test(this.userPwd)) {
                modal.alert({
                    message: "密码：6~16个字符，区分大小写",
                    duration: 0.3,
                    okTitle: "确定"
                }, function (e) {});
                return false;
            }
            if (this.nextUserPwd != this.userPwd) {
                modal.toast({ message: '输入的2次密码不同' });
                return;
            }

            if (self.datatime.judgetime) {
                self.isShowLoad = true;
                apis.requireSignUpValidate({
                    "account": self.userName,
                    "emailOrPhone": self.mobileNo,
                    "password": self.userPwd,
                    "confirmPassword": self.nextUserPwd
                }, function (res) {
                    self.isShowLoad = false;
                    if (res.respond.ok) {
                        self.datatime.judgetime = false;
                        self.datatime.timetext = '60秒';
                        var timer = setInterval(function () {
                            self.datatime.time = self.datatime.time - 1;
                            if (self.datatime.time > 0) {
                                if ((self.datatime.time + '').length != 1) {
                                    self.datatime.timetext = self.datatime.time + '秒';
                                } else {
                                    self.datatime.timetext = '0' + self.datatime.time + '秒';
                                }
                            } else {
                                self.datatime.judgetime = true;
                                clearInterval(timer);
                                self.datatime.timetext = '重新发送';
                                self.datatime.time = 60;
                            }
                        }, 1000);
                    } else {
                        modal.toast({ message: res.respond.msg, duration: 1 });
                    }
                });
            }
        },
        /*处理登录*/
        register: function register() {
            var self = this;
            if (this.userName.length < 1) {
                modal.toast({ message: '请输入用户名' });
                return;
            }if (this.mobileNo.length < 1) {
                modal.toast({ message: '请输入手机号或邮箱' });
                return;
            }
            var validationPhone = /^((\+?[0-9]{1,4})|(\(\+86\)))?(13|14|15|17|18)\d{9}$/;
            var validationMail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if (!validationPhone.test(this.mobileNo) && !validationMail.test(this.mobileNo)) {
                modal.toast({ message: '手机号或邮箱格式有误' });
                return false;
            }
            var validationName = /^(?!_)(?!.*?_$)^(?!(\d+)$)[\u4e00-\u9fff\w]{3,12}$/;
            if (!validationName.test(this.userName)) {

                modal.alert({
                    message: "用户名：3-12个字符 ，可使用汉字、字母、数字、下划线，不能为纯数字，且首末字符不能为下划线",
                    duration: 0.3,
                    okTitle: "确定"
                }, function (e) {});
                return false;
            }
            if (this.userPwd.length < 1) {
                modal.toast({ message: '请输入密码' });
                return;
            }

            // var validationPwd = /^(?!^\d+$)[\@A-Za-z\d\!\#\$\%\^\&\*\.\~]{6,16}$/;
            var validationPwd = /^.{6,16}$/;
            if (!validationPwd.test(this.userPwd)) {
                // modal.toast({ message: '密码格式有误'})
                modal.alert({
                    message: "密码：6~16个字符，区分大小写",
                    duration: 0.3,
                    okTitle: "确定"
                }, function (e) {});
                return false;
            }
            if (this.nextUserPwd != this.userPwd) {
                modal.toast({ message: '输入的2次密码不同' });
                return;
            }
            if (this.vCode.length < 1) {
                modal.toast({ message: '请输入验证码' });
                return;
            }
            self.isShowLoad = true;
            apis.requireSignUp({
                "account": self.userName,
                "emailOrPhone": self.mobileNo,
                "password": self.userPwd,
                "confirmPassword": self.nextUserPwd,
                "validateCode": self.vCode
            }, function (res) {
                self.isShowLoad = false;
                if (res.respond.ok) {
                    modal.toast({ message: '注册成功', duration: 0.5 });
                    event.isLoginGlobalEvent("login", true);
                    event.dismissViewController("");
                    // self.loginData = res.data;
                    console.log(res.data);
                } else {
                    modal.toast({ message: res.respond.msg, duration: 1 });
                }
            });
        }
    }
};

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcMinibar = __webpack_require__(125);

var _wxcMinibar2 = _interopRequireDefault(_wxcMinibar);

var _wxcCell = __webpack_require__(110);

var _wxcCell2 = _interopRequireDefault(_wxcCell);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _type = __webpack_require__(132);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apis = __webpack_require__(46); //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, WxcCell: _wxcCell2.default, WxcMinibar: _wxcMinibar2.default },
    data: function data() {
        return {
            leftButton: _type.RETURN_ICON,
            textone: '您还没有加入任何团队'
        };
    },
    computed: {},
    created: function created() {
        var self = this;
    },

    methods: {
        minibarLeftButtonClick: function minibarLeftButtonClick() {
            event.dismissViewController("");
        }
    }
};

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcCell = __webpack_require__(110);

var _wxcCell2 = _interopRequireDefault(_wxcCell);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _pcenterHeader = __webpack_require__(111);

var _pcenterHeader2 = _interopRequireDefault(_pcenterHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var apis = __webpack_require__(46);
var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
var globalEvent = weex.requireModule('globalEvent');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, pcenterHeader: _pcenterHeader2.default, WxcCell: _wxcCell2.default },
    data: function data() {
        return {
            fontSize: '15px',
            color: '#292b32',
            infoInData: "http://www.51bb8.com"
        };
    },
    computed: {},
    created: function created() {
        var self = this;
    },

    methods: {
        wxcCellClicked: function wxcCellClicked(e) {},
        goDisclaimer: function goDisclaimer() {
            event.openURL(apis.apiURL.basepath + "index.js?#/disclaimer", "免责声明", "push");
        },
        goAboutUs: function goAboutUs() {
            event.openURL(apis.apiURL.basepath + "index.js?#/aboutUs", "关于我们", "push");
        }
    }
};

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcCell = __webpack_require__(110);

var _wxcCell2 = _interopRequireDefault(_wxcCell);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _pcenterHeader = __webpack_require__(111);

var _pcenterHeader2 = _interopRequireDefault(_pcenterHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var apis = __webpack_require__(46);
var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, pcenterHeader: _pcenterHeader2.default, WxcCell: _wxcCell2.default },
    data: function data() {
        return {
            titleone: '在您使用本网站各项服务之前，请仔细阅读本声明的所有条款。凡以任何方式登陆浏览本网站内容或直接、间接使用本网站内容者，视为无条件接受本声明。',
            titletwo: '风险提示：本网站承诺提供专业资讯服务，但不承诺投资者获取收益，也不与投资者约定分享投资收益或分担投资损失。市场有风险，投资需谨慎。',
            textone: '一、本网站依法提供数字货币行情资讯业务。如有发现任何机构或个人冒用本网站或本网站工作人员在网络上非法从事投资咨询业务，请及时与本网站联系，本网站保留对侵权机构或个人追究法律责任的权利。',
            texttwo: '二、本网站的内容受法律法规及国际条约的保护。除法律另有规定或本网站与第三方另有约定外，本网站提供的所有资料以及相关软件程序的知识产权均归属本网站所有。',
            textthree: '三、任何机构或者个人使用本网站，均应遵守有关法律法规、国际条约及本声明，不得破坏本网站运行安全，不得利用本网站进行任何违法活动，不得损害本网站的合法权益。',
            textfour: '四、未经本网站书面许可，任何机构或个人不得以向他人出售牟利为目的使用本网站的任何内容，此种使用包括但不限于拷贝、下载、存贮、通过硬盘拷贝或电子抓取系统获取、发送、转换、出租、演示、转载、复制、修改、销售、传播、出版或任何其它形式的散发。',
            textfive: '五、 本网站对所提供的内容力求准确、完整和及时，但并不对其准确性、完整性和及时性做出任何保证。对任何因直接或间接使用本网站内容而造成的损失，包括但不限于因有关内容不准确、不完整而导致的损失，本网站不承担任何法律责任。本网站亦不保证所设置的外部链接的准确性和完整性，该外部链接指向的任何网页内容，本网站对其合法性概不负责，亦不承担任何法律责任。',
            textsix: '六、 权利人认为本网站所提供的信息存储空间、搜索或链接服务存储、搜索或链接的内容所涉及的作品侵犯了其信息网络传播权或者被删除、改变了自己的权利管理电子信息的，可依法向本网站提交书面通知。权利人应对通知书的真实性负责，并承担由于通知书内容不真实所导致的全部法律责任。',
            textseven: '七、 本声明受相关法律及国际条约的约束并依据其解释。如出现纠纷，双方应友好协商，协商不成，任何一方可提请本网站所在地人民法院诉讼解决。在法律允许的最大范围内，本条款最终解释权归本网站享有。'

        };
    },
    computed: {},
    created: function created() {
        var self = this;
    },

    methods: {}
};

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wxcCell = __webpack_require__(110);

var _wxcCell2 = _interopRequireDefault(_wxcCell);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _pcenterHeader = __webpack_require__(111);

var _pcenterHeader2 = _interopRequireDefault(_pcenterHeader);

var _loginHeader = __webpack_require__(87);

var _loginHeader2 = _interopRequireDefault(_loginHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apis = __webpack_require__(46); //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
exports.default = {
  components: { WxcLoading: _wxcLoading2.default, loginHeader: _loginHeader2.default, WxcCell: _wxcCell2.default },
  data: function data() {
    return {
      data: { title: "免责声明" },
      titleone: '在您使用本网站各项服务之前，请仔细阅读本声明的所有条款。凡以任何方式登陆浏览本网站内容或直接、间接使用本网站内容者，视为无条件接受本声明。',
      titletwo: '风险提示：本网站承诺提供专业资讯服务，但不承诺投资者获取收益，也不与投资者约定分享投资收益或分担投资损失。市场有风险，投资需谨慎。',
      textone: '一、本网站依法提供数字货币行情资讯业务。如有发现任何机构或个人冒用本网站或本网站工作人员在网络上非法从事投资咨询业务，请及时与本网站联系，本网站保留对侵权机构或个人追究法律责任的权利。',
      texttwo: '二、本网站的内容受法律法规及国际条约的保护。除法律另有规定或本网站与第三方另有约定外，本网站提供的所有资料以及相关软件程序的知识产权均归属本网站所有。',
      textthree: '三、任何机构或者个人使用本网站，均应遵守有关法律法规、国际条约及本声明，不得破坏本网站运行安全，不得利用本网站进行任何违法活动，不得损害本网站的合法权益。',
      textfour: '四、未经本网站书面许可，任何机构或个人不得以向他人出售牟利为目的使用本网站的任何内容，此种使用包括但不限于拷贝、下载、存贮、通过硬盘拷贝或电子抓取系统获取、发送、转换、出租、演示、转载、复制、修改、销售、传播、出版或任何其它形式的散发。',
      textfive: '五、 本网站对所提供的内容力求准确、完整和及时，但并不对其准确性、完整性和及时性做出任何保证。对任何因直接或间接使用本网站内容而造成的损失，包括但不限于因有关内容不准确、不完整而导致的损失，本网站不承担任何法律责任。本网站亦不保证所设置的外部链接的准确性和完整性，该外部链接指向的任何网页内容，本网站对其合法性概不负责，亦不承担任何法律责任。',
      textsix: '六、 权利人认为本网站所提供的信息存储空间、搜索或链接服务存储、搜索或链接的内容所涉及的作品侵犯了其信息网络传播权或者被删除、改变了自己的权利管理电子信息的，可依法向本网站提交书面通知。权利人应对通知书的真实性负责，并承担由于通知书内容不真实所导致的全部法律责任。',
      textseven: '七、 本声明受相关法律及国际条约的约束并依据其解释。如出现纠纷，双方应友好协商，协商不成，任何一方可提请本网站所在地人民法院诉讼解决。在法律允许的最大范围内，本条款最终解释权归本网站享有。'

    };
  },
  computed: {},
  created: function created() {
    var self = this;
  },

  methods: {}
};

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcPopover = __webpack_require__(179);

var _wxcPopover2 = _interopRequireDefault(_wxcPopover);

var _wxcButton = __webpack_require__(94);

var _wxcButton2 = _interopRequireDefault(_wxcButton);

var _wxcMinibar = __webpack_require__(125);

var _wxcMinibar2 = _interopRequireDefault(_wxcMinibar);

var _wxcCell = __webpack_require__(110);

var _wxcCell2 = _interopRequireDefault(_wxcCell);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _pcenterHeader = __webpack_require__(111);

var _pcenterHeader2 = _interopRequireDefault(_pcenterHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var apis = __webpack_require__(46);
var common = __webpack_require__(133);
var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
var globalEvent = weex.requireModule('globalEvent');
var clipboard = weex.requireModule('clipboard');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, pcenterHeader: _pcenterHeader2.default, WxcCell: _wxcCell2.default, WxcMinibar: _wxcMinibar2.default, WxcButton: _wxcButton2.default, WxcPopover: _wxcPopover2.default },
    data: function data() {
        return {
            fontSize: '15px',
            color: '#292b32',
            userNumber: '',
            userPassword: '',
            data: { title: "" },
            isShowLoad: false,
            resData: { account: "---", phone: "---", lastLoginTime: "---", email: "---", registTime: "---", pwd: "---" },
            interval: 0,
            type: 'default',
            loadingText: '加载中',
            isLogin: false,
            cellStyle: {
                height: "110px"
            },
            loginStyle: {
                height: "160px"
            },
            popoverStyle: {
                color: '#ffffff',
                background: "#000000"
            },
            btns2: [{
                text: '复制',
                key: 's1'
            }],
            popoverPosition2: { x: 590, y: 310 },
            popoverArrowPosition2: { pos: 'bottom', x: 52 }
        };
    },
    computed: {},
    created: function created() {
        var self = this;

        if (this.$getConfig().isLogin != undefined) {
            this.isLogin = this.$getConfig().isLogin;
        }
        // if (apis.getParameterByName('isLogin', this.bundleUrl) != undefined){
        //      modal.toast({message:"getParameterByName",duration:1});
        //     this.isLogin = apis.getParameterByName('isLogin', this.bundleUrl);
        // }
        if (self.isLogin) {
            self.userInfo();
        }
        globalEvent.addEventListener("login", function (e) {
            self.isLogin = e.ok;
            if (self.isLogin) {
                self.userInfo();
            } else {
                //  self.resData = {account:"---",phone:"---",lastLoginTime:"---",email:"---",registTime:"---",pwd:"---"};
            }
        });
    },

    methods: {
        isAndroid: function isAndroid() {
            return _util2.default.env.isAndroid();
        },
        openController: function openController(controllerName) {
            event.openController(controllerName);
        },
        popoverButtonClicked: function popoverButtonClicked(obj) {
            modal.toast({ 'message': 'key:' + obj.key + ', index:' + obj.index, 'duration': 1 });
        },
        wxcButtonClicked: function wxcButtonClicked() {
            var ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'wxc-popover2';

            this.$refs[ref].wxcPopoverShow();
        },
        userInfo: function userInfo() {
            var self = this;
            self.isShowLoad = true;
            apis.requireUserInfo({}, function (res) {
                self.isShowLoad = false;
                if (res.respond.ok) {
                    self.resData = res.data;
                    self.resData.pwd = "******";
                    if (res.data.email == null) {
                        self.resData.email = "---";
                    }
                    if (res.data.phone == null) {
                        self.resData.phone = res.data.email;
                    }
                    if (res.data.lastLoginTime != null) {

                        self.resData.lastLoginTime = _util2.default.formatDate(res.data.lastLoginTime);
                    }
                    if (res.data.registTime != null) {

                        self.resData.registTime = _util2.default.formatDate(res.data.registTime);
                    }
                    console.log(res.data);
                } else {
                    modal.toast({ message: res.respond.msg, duration: 1 });
                }
            });
        },


        modifyPassword: function modifyPassword() {
            // this.$router.push({path:"/modifySendCode",query:{"title":"修改密码"}})
            if (this.isLogin) {
                event.openURL(apis.apiURL.basepath + "index.js?#/modifySendCode");
            } else {
                modal.toast({ message: "未登录", duration: 0.5 });
            }
        },
        modifyInfo: function modifyInfo() {
            if (this.isLogin) {
                event.openURL(apis.apiURL.basepath + "index.js?#/modifyInfo");
            } else {
                modal.toast({ message: "未登录", duration: 0.5 });
            }
        },
        goDisclaimer: function goDisclaimer() {
            event.openURL(apis.apiURL.basepath + "index.js?#/disclaimer", "免责声明", "push");
        },
        goAboutUs: function goAboutUs() {
            event.openURL(apis.apiURL.basepath + "index.js?#/aboutUs", "关于我们", "push");
        },
        wxcCellClicked: function wxcCellClicked(e) {
            console.log(e);
            event.openURL(apis.apiURL.basepath + "index.js?#/contactUs", "联系我们", "push");
        },
        goUserInfo: function goUserInfo(e) {
            event.openURL(apis.apiURL.basepath + "index.js?#/personalInfo", "我的信息", "push");
        },
        goSettingPage: function goSettingPage(e) {
            event.openController("SettingViewController");
        },
        goLogin: function goLogin() {
            event.openURL(apis.apiURL.basepath + "index.js");
        },
        openWebView: function openWebView(url) {
            event.openWebView(url, "");
        },
        setClipBoard: function setClipBoard(res) {
            clipboard.setString(res);
        },
        valedateExit: function valedateExit() {
            var self = this;
            modal.confirm({
                message: "确定退出当前账号？",
                okTitle: "确定",
                cancelTitle: "取消"
            }, function (e) {
                if (e == "确定") {
                    self.exitLogin();
                }
            });
        },
        exitLogin: function exitLogin() {
            var self = this;
            self.isShowLoad = true;
            apis.requireLogout(function (res) {
                self.isShowLoad = false;
                if (res.respond.ok) {
                    event.isLoginGlobalEvent("login", false);
                    event.openURL(apis.apiURL.basepath + "index.js");
                } else {
                    modal.toast({ message: res.respond.msg, duration: 1 });
                }
            });
        }
    }
};

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wxcCell = __webpack_require__(110);

var _wxcCell2 = _interopRequireDefault(_wxcCell);

var _wxcLoading = __webpack_require__(49);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _pcenterHeader = __webpack_require__(111);

var _pcenterHeader2 = _interopRequireDefault(_pcenterHeader);

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var apis = __webpack_require__(46);
var common = __webpack_require__(133);
var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
var globalEvent = weex.requireModule('globalEvent');
exports.default = {
    components: { WxcLoading: _wxcLoading2.default, pcenterHeader: _pcenterHeader2.default, WxcCell: _wxcCell2.default },
    data: function data() {
        return {
            fontSize: '15px',
            color: '#292b32',
            userNumber: '',
            userPassword: '',
            data: { title: "" },
            isShowLoad: false,
            resData: { account: "---", phone: "---", lastLoginTime: "---", email: "---", registTime: "---", pwd: "---" },
            interval: 0,
            type: 'default',
            loadingText: '加载中',
            isLogin: true,
            cellStyle: {
                height: "160px"
            }
        };
    },
    computed: {},
    created: function created() {
        var self = this;
        self.userInfo();
        globalEvent.addEventListener("login", function (e) {
            self.isLogin = e.ok;
            if (self.isLogin) {
                self.userInfo();
            }
        });
    },

    methods: {
        userInfo: function userInfo() {
            var self = this;
            self.isShowLoad = true;
            apis.requireUserInfo({}, function (res) {
                self.isShowLoad = false;
                if (res.respond.ok) {
                    self.resData = res.data;
                    self.resData.pwd = "******";
                    if (res.data.email == null) {
                        self.resData.email = "---";
                    }
                    if (res.data.phone == null) {
                        self.resData.phone = res.data.email;
                    }
                    if (res.data.lastLoginTime != null) {

                        self.resData.lastLoginTime = _util2.default.formatDate(res.data.lastLoginTime);
                    }
                    if (res.data.registTime != null) {

                        self.resData.registTime = _util2.default.formatDate(res.data.registTime);
                    }
                    console.log(res.data);
                } else {
                    modal.toast({ message: res.respond.msg, duration: 1 });
                }
            });
        },


        modifyPassword: function modifyPassword() {
            // this.$router.push({path:"/modifySendCode",query:{"title":"修改密码"}})
            if (this.isLogin) {
                event.openURL(apis.apiURL.basepath + "index.js?#/modifySendCode");
            } else {
                modal.toast({ message: "未登录", duration: 0.5 });
            }
        },
        modifyInfo: function modifyInfo() {
            if (this.isLogin) {
                event.openURL(apis.apiURL.basepath + "index.js?#/modifyInfo");
            } else {
                modal.toast({ message: "未登录", duration: 0.5 });
            }
        },
        wxcCellClicked: function wxcCellClicked(e) {
            console.log(e);
            event.openURL(apis.apiURL.basepath + "index.js?#/contactUs", "联系我们", "push");
        },
        goLogin: function goLogin() {
            event.openURL(apis.apiURL.basepath + "index.js");
        },
        valedateExit: function valedateExit() {
            var self = this;
            modal.confirm({
                message: "确定退出当前账号？",
                okTitle: "确定",
                cancelTitle: "取消"
            }, function (e) {
                if (e == "确定") {
                    self.exitLogin();
                }
            });
        },
        exitLogin: function exitLogin() {
            var self = this;
            self.isShowLoad = true;
            apis.requireLogout(function (res) {
                self.isShowLoad = false;
                if (res.respond.ok) {
                    event.isLoginGlobalEvent("login", false);
                    event.openURL(apis.apiURL.basepath + "index.js");
                } else {
                    modal.toast({ message: res.respond.msg, duration: 1 });
                }
            });
        }
    }
};

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _UserHeader = __webpack_require__(135);

var _UserHeader2 = _interopRequireDefault(_UserHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  components: { UserHeader: _UserHeader2.default },
  computed: {
    userId: function userId() {
      // if (this.$route && this.$route.params) {
      //   return this.$route.params.id
      // }
      return 'fengfeng';
    },
    user: function user() {
      // return this.$store.state.users[this.userId]
      return { userId: "fengfeng", created: "20180215", karma: "xfjdllgmmdd", about: "42523252" };
    }
  },

  created: function created() {
    //   this.$store.dispatch('FETCH_USER', { id: this.userId })
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

var _loginHeader = __webpack_require__(87);

var _loginHeader2 = _interopRequireDefault(_loginHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var navigator = weex.requireModule('navigator');
var webview = weex.requireModule('webview');
var modal = weex.requireModule('modal');
var event = weex.requireModule('event');
exports.default = {
    components: { loginHeader: _loginHeader2.default },
    date: {
        tlt: '',
        data: { title: "" }
    },
    beforeCreate: function beforeCreate() {
        console.group('beforeCreate 创建前状态===============》');
    },
    created: function created() {
        console.log('webPageURL...', weex.config.bundleUrl);
        _util2.default.initIconFont();

        var bundleUrl = weex.config.bundleUrl;
        // this.url=util.getUrlSearch(bundleUrl,'weburl')
        this.url = "http://www.51bb8.com/web/policy.docx";
        // modal.toast({ message: weburl,  duration: 1 })

        // this.url=util.setBundleUrl(bundleUrl,weburl,true);
        this.tlt = _util2.default.getUrlSearch(bundleUrl, 'title');

        modal.toast({ message: this.url, duration: 1 });

        console.log('webPageURL', this.url);
    },

    computed: {
        isipx: function isipx() {
            return weex && (weex.config.env.deviceModel === 'iPhone10,3' || weex.config.env.deviceModel === 'iPhone10,6');
        }
    },
    methods: {
        back: function back(event) {
            webview.goBack(this.$refs.wv);
        },
        close: function close(event) {
            navigator.pop({
                animated: "true"
            });
        },
        reload: function reload(event) {
            webview.reload(this.$refs.wv);
        },
        error: function error(event) {
            console.log('error', event);
        },
        closeBack: function closeBack() {
            this.jumpBack();
        }
    }
};

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.wrapper[data-v-2d6f70d4]{\n    position: fixed;\n    top: 0;\n    left: 0;right: 0;\n    height: 114px;\n    padding-top: 44px;\n    display:flex;\n    flex-wrap: nowrap;\n    flex-direction: row;\n    justify-content: space-around;\n    z-index: 101;\n    background-color: #fafafa;\n    opacity: .99;\n}\n.w-ipx[data-v-2d6f70d4]{\n    height: 154px;\n    padding-top: 84px;\n}\n.scan[data-v-2d6f70d4],.notice[data-v-2d6f70d4]{\n    height: 80px;\n    width: 96px\n}\n.ic[data-v-2d6f70d4],.txt[data-v-2d6f70d4],.search[data-v-2d6f70d4]{\n    text-align: center;\n    color:#666;\n    font-weight: 300;\n}\n.ic[data-v-2d6f70d4]{\n    font-size: 32px;\n}\n.txt[data-v-2d6f70d4]{\n    font-size: 18px;\n}\n.search[data-v-2d6f70d4] {\n    flex: 1;\n    height: 60px;\n    font-size: 26px;\n    padding-top: 13px;\n    background-color: #ededed;\n    border-radius: 8px;\n}\n", ""]);

// exports


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.iconfont[data-v-c1186616] {\n    font-family:iconfont;\n}\n.wrapper[data-v-c1186616]{\n    position: fixed;\n    top: 0;\n    left: 0;right: 0;\n    height: 114px;\n    padding-top: 44px;\n    display:flex;\n    flex-wrap: nowrap;\n    flex-direction: row;\n    justify-content: space-around;\n    z-index: 101;\n    background-color: #fafafa;\n    opacity: .99;\n}\n.w-ipx[data-v-c1186616]{\n    height: 154px;\n    padding-top: 84px;\n}\n.scan[data-v-c1186616],.notice[data-v-c1186616]{\n    height: 80px;\n    width: 96px\n}\n.ic[data-v-c1186616],.txt[data-v-c1186616],.search[data-v-c1186616]{\n    text-align: center;\n    color:#666;\n    font-weight: 300;\n}\n.ic[data-v-c1186616]{\n    font-size: 32px;\n}\n.txt[data-v-c1186616]{\n    font-size: 18px;\n}\n.search[data-v-c1186616] {\n    flex: 1;\n    height: 60px;\n    font-size: 26px;\n    padding-top: 13px;\n    background-color: #ededed;\n    border-radius: 8px;\n}\n", ""]);

// exports


/***/ }),
/* 157 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { class: ["wrapper", _vm.isIpx && _vm.isIpx() ? "w-ipx" : ""] },
    [
      _c("div", { staticClass: "scan" }, [
        _c("text", { staticClass: "ic iconfont" }, [_vm._v("")])
      ]),
      _vm._v(" "),
      _c(
        "text",
        {
          staticClass: "iconfont",
          on: {
            click: function($event) {
              return _vm.jumpWeb()
            }
          }
        },
        [_vm._v("币行情")]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "notice" }, [
        _c("text", { staticClass: "ic iconfont" }, [_vm._v("")])
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2d6f70d4", esExports)
  }
}

/***/ }),
/* 158 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { class: ["wrapper", _vm.isIpx && _vm.isIpx() ? "w-ipx" : ""] },
    [
      _c("div", { staticClass: "scan" }, [
        _c("text", { staticClass: "ic iconfont" }, [_vm._v("")])
      ]),
      _vm._v(" "),
      _c(
        "text",
        {
          staticClass: "iconfont",
          on: {
            click: function($event) {
              return _vm.jumpWeb()
            }
          }
        },
        [_vm._v("用户中心")]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "notice" }, [
        _c("text", { staticClass: "ic iconfont" }, [_vm._v("")])
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-c1186616", esExports)
  }
}

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(155);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("8b485494", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2d6f70d4\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./header.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2d6f70d4\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./header.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(156);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("009f1c19", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c1186616\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./UserHeader.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c1186616\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./UserHeader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 161 */,
/* 162 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tabBar_vue__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tabBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tabBar_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tabBar_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tabBar_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f57a2d20_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_tabBar_vue__ = __webpack_require__(231);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(262)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-f57a2d20"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tabBar_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f57a2d20_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_tabBar_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/components/tabBar.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f57a2d20", Component.options)
  } else {
    hotAPI.reload("data-v-f57a2d20", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 163 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_61472db0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_home_vue__ = __webpack_require__(222);
var disposed = false
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_61472db0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_home_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/home/home.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-61472db0", Component.options)
  } else {
    hotAPI.reload("data-v-61472db0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 164 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_285305fc_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_main_vue__ = __webpack_require__(217);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(239)
  __webpack_require__(240)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-285305fc"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_285305fc_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_main_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/home/main.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-285305fc", Component.options)
  } else {
    hotAPI.reload("data-v-285305fc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 165 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fastLogin_vue__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fastLogin_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fastLogin_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fastLogin_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fastLogin_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6b0aecc0_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_fastLogin_vue__ = __webpack_require__(224);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(248)
  __webpack_require__(249)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6b0aecc0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fastLogin_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6b0aecc0_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_fastLogin_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/login/fastLogin.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6b0aecc0", Component.options)
  } else {
    hotAPI.reload("data-v-6b0aecc0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 166 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_79d5601c_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_login_vue__ = __webpack_require__(226);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(252)
  __webpack_require__(253)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-79d5601c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_79d5601c_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_login_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/login/login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-79d5601c", Component.options)
  } else {
    hotAPI.reload("data-v-79d5601c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 167 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyInfo_vue__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyInfo_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyInfo_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyInfo_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyInfo_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4fdf6165_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_modifyInfo_vue__ = __webpack_require__(221);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(245)
  __webpack_require__(246)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4fdf6165"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyInfo_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4fdf6165_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_modifyInfo_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/login/modifyInfo.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4fdf6165", Component.options)
  } else {
    hotAPI.reload("data-v-4fdf6165", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 168 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyPwd_vue__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyPwd_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyPwd_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyPwd_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyPwd_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_10c1e354_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_modifyPwd_vue__ = __webpack_require__(214);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(234)
  __webpack_require__(235)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-10c1e354"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifyPwd_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_10c1e354_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_modifyPwd_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/login/modifyPwd.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-10c1e354", Component.options)
  } else {
    hotAPI.reload("data-v-10c1e354", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 169 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifySendCode_vue__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifySendCode_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifySendCode_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifySendCode_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifySendCode_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_214f1168_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_modifySendCode_vue__ = __webpack_require__(216);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(237)
  __webpack_require__(238)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-214f1168"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_modifySendCode_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_214f1168_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_modifySendCode_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/login/modifySendCode.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-214f1168", Component.options)
  } else {
    hotAPI.reload("data-v-214f1168", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 170 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_register_vue__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_register_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_register_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_register_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_register_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b7e71980_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_register_vue__ = __webpack_require__(229);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(258)
  __webpack_require__(259)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-b7e71980"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_register_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b7e71980_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_register_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/login/register.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b7e71980", Component.options)
  } else {
    hotAPI.reload("data-v-b7e71980", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 171 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_aboutUs_vue__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_aboutUs_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_aboutUs_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_aboutUs_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_aboutUs_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c92751cc_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_aboutUs_vue__ = __webpack_require__(230);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(260)
  __webpack_require__(261)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-c92751cc"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_aboutUs_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c92751cc_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_aboutUs_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/pcenter/aboutUs.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c92751cc", Component.options)
  } else {
    hotAPI.reload("data-v-c92751cc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 172 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_contactUs_vue__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_contactUs_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_contactUs_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_contactUs_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_contactUs_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4df57bad_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_contactUs_vue__ = __webpack_require__(219);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(242)
  __webpack_require__(243)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4df57bad"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_contactUs_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4df57bad_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_contactUs_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/pcenter/contactUs.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4df57bad", Component.options)
  } else {
    hotAPI.reload("data-v-4df57bad", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 173 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_disclaimer_vue__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_disclaimer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_disclaimer_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_disclaimer_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_disclaimer_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7fe16f48_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_disclaimer_vue__ = __webpack_require__(228);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(256)
  __webpack_require__(257)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7fe16f48"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_disclaimer_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7fe16f48_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_disclaimer_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/pcenter/disclaimer.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7fe16f48", Component.options)
  } else {
    hotAPI.reload("data-v-7fe16f48", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 174 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginDisclaimer_vue__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginDisclaimer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginDisclaimer_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginDisclaimer_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginDisclaimer_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_000bae73_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_loginDisclaimer_vue__ = __webpack_require__(213);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(232)
  __webpack_require__(233)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-000bae73"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loginDisclaimer_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_000bae73_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_loginDisclaimer_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/pcenter/loginDisclaimer.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-000bae73", Component.options)
  } else {
    hotAPI.reload("data-v-000bae73", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 175 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personal_vue__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personal_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personal_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personal_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personal_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7f9f167e_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_personal_vue__ = __webpack_require__(227);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(254)
  __webpack_require__(255)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7f9f167e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personal_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7f9f167e_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_personal_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/pcenter/personal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7f9f167e", Component.options)
  } else {
    hotAPI.reload("data-v-7f9f167e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 176 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personalInfo_vue__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personalInfo_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personalInfo_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personalInfo_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personalInfo_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6be20be2_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_personalInfo_vue__ = __webpack_require__(225);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(250)
  __webpack_require__(251)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6be20be2"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_personalInfo_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6be20be2_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_personalInfo_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/pcenter/personalInfo.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6be20be2", Component.options)
  } else {
    hotAPI.reload("data-v-6be20be2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 177 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserView_vue__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserView_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserView_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserView_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserView_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_294ca5e6_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_UserView_vue__ = __webpack_require__(218);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(241)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-294ca5e6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UserView_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_294ca5e6_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_UserView_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/user/UserView.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-294ca5e6", Component.options)
  } else {
    hotAPI.reload("data-v-294ca5e6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 178 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_webview_vue__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_webview_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_webview_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_webview_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_webview_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6766af5c_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_webview_vue__ = __webpack_require__(223);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(247)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6766af5c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_webview_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6766af5c_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_webview_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/page/webview.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6766af5c", Component.options)
  } else {
    hotAPI.reload("data-v-6766af5c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(212);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(50);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.main_out[data-v-000bae73]{\r\n    width: 750px;\n}\n.main_centent[data-v-000bae73]{\r\n    padding-top:20px;\r\n    padding-left:40px;\r\n    padding-right:30px\n}\n.text_one[data-v-000bae73]{\r\n    color:#3a3a3a;\r\n    font-size: 28px;\r\n    line-height: 55px;\n}\n.phone_image[data-v-000bae73]{\r\n    width: 55px;\r\n    height: 55px;\r\n    margin-right: 20px;\n}\n.default_image[data-v-000bae73]{\r\n    width: 90px;\r\n    height: 90px;\r\n    margin-right: 30px;\n}\n.personal_center[data-v-000bae73]{\r\n    width: 750px;\r\n    border-top-color:#E2E2E2;\r\n    border-top-width: 1px;\n}\n.exit_btn_out[data-v-000bae73]{\r\n    padding-top: 10px;\r\n    padding-bottom: 10px;\r\n    padding-right: 20px;\r\n    padding-left: 20px;\r\n    border-radius: 10px;  \r\n    margin-top: 15px;\r\n    border-color:#000000;\r\n    border-width: 1px;\n}\n.exit_btn[data-v-000bae73]{\r\n    font-size: 30px\n}\n.user_name[data-v-000bae73]{\r\n    font-size: 30px;\r\n    margin-top: 15px\n}\n.personal_header[data-v-000bae73]{\r\n    width: 750px;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n   padding-top: 80px;\r\n   padding-bottom: 80px;\n}\n.personal_out[data-v-000bae73]{\r\n    justify-content: center;\r\n    align-items: center;\n}\n.user_logo[data-v-000bae73]{\r\n    width:120px;\r\n    height: 120px;\n}\r\n\r\n", ""]);

// exports


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.login_header[data-v-10c1e354]{\r\n    margin-top: 120px;\n}\n.register_footer[data-v-10c1e354]{\r\n    width:100%;\r\n    position:fixed;\r\n    bottom:30px;\r\n    text-align:center\n}\n.btn_register[data-v-10c1e354]{\r\n    background-color:#ffe45f;\r\n    margin-top: 50px\n}\n.register_out[data-v-10c1e354] {\r\n    align-items: center;\r\n    justify-content: center;\r\n    margin-top: 100px;\n}\n.bb8_logo[data-v-10c1e354]{\r\n    width:450px;\r\n    height: 102px;\r\n    margin-top:150px;\r\n    margin-bottom: 150px;\n}\n.register_title[data-v-10c1e354]{\r\n    padding-top: 30px;\r\n    margin-bottom: 100px\n}\n.input_wrapper[data-v-10c1e354]{  \r\n    width: 650px;  \r\n    margin-left: 100px;  \r\n    margin-right: 100px;  \r\n    margin-bottom: 40px;\n}\n.send_code_out[data-v-10c1e354]{\r\n    flex-direction: row;\r\n    justify-content: space-around;\n}\n.input_code_out[data-v-10c1e354]{  \r\n    width: 450px;  \r\n    margin-right: 30px;\n}\n.input_code_btn[data-v-10c1e354]{  \r\n    width: 170px;  \r\n    text-align: center\n}\n.input[data-v-10c1e354] {  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    padding-left: 70px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;  \r\n    font-size: 28px;\r\n    placeholder-color:#c2c2c2\n}\n.input_code[data-v-10c1e354] {  \r\n    height: 85px;  \r\n    width: 450px;  \r\n    padding-left: 90px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;\n}\n.input_img[data-v-10c1e354]{  \r\n    position: absolute;  \r\n    top:21px;  \r\n    left: 18px;  \r\n    width:40px;  \r\n    height: 40px;\n}\n.input_register[data-v-10c1e354]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    border-radius: 10px;  \r\n    margin-top: 60px;  \r\n    background-color: #ffe45f;\n}\n.input_register[data-v-10c1e354]:active{  \r\n    background-color: #FFED93;\n}\n.input_register_text[data-v-10c1e354]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    text-align: center;  \r\n    line-height: 85px;  \r\n    font-size: 30px\n}\n.register_text[data-v-10c1e354]{\r\n    font-size: 30px\n}\n.send_code[data-v-10c1e354]{\r\n    border-radius: 10px;  \r\n    height: 85px;  \r\n    line-height: 85px; \r\n    width: 170px ;\r\n    text-align: center;\r\n    padding: 0 10px;\r\n    font-size: 30px\n}\n.input_forget[data-v-10c1e354]{  \r\n    position: absolute;  \r\n    left: 30px;\n}    \r\n", ""]);

// exports


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.g-cover[data-v-1a7e9f9e] {\n  position: fixed;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  background-color: rgba(0, 0, 0, 0.4);\n}\n.wxc-popover[data-v-1a7e9f9e] {\n  position: fixed;\n  background-color: #fff;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.21);\n  border-radius: 6px;\n}\n.u-popover-arrow[data-v-1a7e9f9e] {\n  position: absolute;\n  border-radius: 4px;\n  width: 30px;\n  height: 30px;\n  background-color: #fff;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.21);\n}\n.u-popover-inner[data-v-1a7e9f9e] {\n  display: block;\n  border-radius: 10px;\n  background-color: #fff;\n}\n.i-btn[data-v-1a7e9f9e] {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  margin-left: 20px;\n  margin-right: 20px;\n  padding-left: 20px;\n  padding-right: 20px;\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: #ddd;\n}\n.i-btn-noborder[data-v-1a7e9f9e] {\n  border-top-color: #fff;\n}\n.btn-icon[data-v-1a7e9f9e] {\n  width: 32px;\n  height: 32px;\n  margin-right: 16px;\n}\n.btn-text[data-v-1a7e9f9e] {\n  flex: 1;\n  height: 80px;\n  font-size: 30px;\n  line-height: 80px;\n  text-align: left;\n}\n.text-align-center[data-v-1a7e9f9e] {\n  text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.hint_out[data-v-214f1168]{\r\n     width: 650px;  \r\n    justify-content: flex-start;\n}\n.hint_text[data-v-214f1168]{\r\n  font-size: 25px;\r\n  color:#BCC1C4;\n}\n.login_header[data-v-214f1168]{\r\n    margin-top: 120px;\n}\n.register_footer[data-v-214f1168]{\r\n    width:100%;\r\n    position:fixed;\r\n    bottom:30px;\r\n    text-align:center\n}\n.btn_register[data-v-214f1168]{\r\n    background-color:#ffe45f;\r\n    margin-top: 50px\n}\n.register_out[data-v-214f1168] {\r\n    align-items: center;\r\n    justify-content: center;\r\n    margin-top: 100px;\n}\n.bb8_logo[data-v-214f1168]{\r\n    width:450px;\r\n    height: 102px;\r\n    margin-top:150px;\r\n    margin-bottom: 150px;\n}\n.register_title[data-v-214f1168]{\r\n    padding-top: 30px;\r\n    margin-bottom: 100px\n}\n.input_wrapper[data-v-214f1168]{  \r\n    width: 650px;  \r\n    margin-left: 100px;  \r\n    margin-right: 100px;  \r\n    margin-bottom: 40px;\n}\n.send_code_out[data-v-214f1168]{\r\n    flex-direction: row;\r\n    justify-content: space-around;\n}\n.input_code_out[data-v-214f1168]{  \r\n    width: 450px;  \r\n    margin-right: 30px;\n}\n.input_code_btn[data-v-214f1168]{  \r\n    width: 170px;  \r\n    text-align: center\n}\n.input[data-v-214f1168] {  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    padding-left: 70px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;  \r\n    font-size: 28px;\r\n    placeholder-color:#c2c2c2\n}\n.input_code[data-v-214f1168] {  \r\n    height: 85px;  \r\n    width: 450px;  \r\n    padding-left: 70px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;  \r\n    font-size: 28px;\r\n    placeholder-color:#c2c2c2\n}\n.input_img[data-v-214f1168]{  \r\n    position: absolute;  \r\n    top:21px;  \r\n    left: 18px;  \r\n    width:40px;  \r\n    height: 40px;\n}\n.input_register[data-v-214f1168]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    border-radius: 10px;  \r\n    margin-top: 60px;  \r\n    background-color: #ffe45f;\n}\n.input_register[data-v-214f1168]:active{  \r\n    background-color: #FFED93;\n}\n.input_register_text[data-v-214f1168]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    text-align: center;  \r\n    line-height: 85px;  \r\n    font-size: 30px\n}\n.register_text[data-v-214f1168]{\r\n    font-size: 30px\n}\n.send_code[data-v-214f1168]{\r\n    border-radius: 10px;  \r\n    height: 85px;  \r\n    line-height: 85px; \r\n    width: 170px ;\r\n    text-align: center;\r\n    padding: 0 10px;\r\n    font-size: 28px\n}\n.input_forget[data-v-214f1168]{  \r\n    position: absolute;  \r\n    left: 30px;\n}  \r\n", ""]);

// exports


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.main_out[data-v-285305fc]{\n}\n.main_content[data-v-285305fc]{\n  flex: 4;\n  flex-direction: column;\n  justify-content: space-around;\n  padding: 10px;\n}\n.main_banners[data-v-285305fc]{\n  flex: 1;\n  justify-content: center;\n  align-items: center\n}\n.main_rows[data-v-285305fc]{\n  flex: 1;\n  flex-direction: row;\n  justify-content: space-around;\n  width: 730px;\n}\n.main_item[data-v-285305fc]{\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  flex: 1;\n  width: 350px;\n  border-radius: 10px;\n  background-color: white;\n  margin: 10px;\n}\n.main_item[data-v-285305fc]:active{\n  background-color: #F5F5F5;\n}\n.item_image[data-v-285305fc]{\n  width: 120px;\n  height: 120px;\n}\n.item_text[data-v-285305fc]{\n  font-size: 28px;\n  color: black;\n  margin-top: 22px;\n}\n.loading-wrapper[data-v-285305fc] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: #fff;\n  justify-content: center;\n  align-items: center;\n}\n.loading[data-v-285305fc] {\n  width: 60px;\n  height: 60px;\n}\n.size[data-v-285305fc] {\n  width: 750px;\n  height: 200px;\n}\n.slider[data-v-285305fc] {\n  position: relative;\n}\n.author[data-v-285305fc] {\n  padding: 5px 10px;\n  position: absolute;\n  right: 0px;\n  bottom: 65px;\n  background-color: rgba(0, 0, 0, 0.3);\n  color: #fff;\n}\n.source[data-v-285305fc] {\n  padding: 5px 10px;\n  position: absolute;\n  right: 0px;\n  bottom: 10px;\n  background-color: rgba(0, 0, 0, 0.3);\n  color: #fff;\n}\n.indicator[data-v-285305fc] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 60px;\n  background-color: rgba(0, 0, 0, 0);\n  item-color: #ddd;\n  item-selected-color:#0056d3;\n}\n", ""]);

// exports


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.user-info[data-v-294ca5e6] {\n  padding-top: 60px;\n  padding-left: 80px;\n  padding-right: 60px;\n}\n.user-name[data-v-294ca5e6] {\n  font-size: 72px;\n  font-weight: bold;\n  margin-bottom: 60px;\n}\n.loading-text[data-v-294ca5e6] {\n  font-family: Verdana, Geneva, sans-serif;\n  font-size: 44px;\n  color: #BBBBBB;\n}\n.meta-label[data-v-294ca5e6] {\n  font-family: Verdana, Geneva, sans-serif;\n  font-size: 32px;\n  margin-bottom: 15px;\n  color: #333333;\n}\n.user-about[data-v-294ca5e6] {\n  margin-top: 20px;\n  font-size: 28px;\n  color: #666666;\n}\n.iconfont[data-v-294ca5e6] {\n      font-family:iconfont;\n}\n.wrapper[data-v-294ca5e6]{\n      background-color: #f4f4f4;\n}\n.fbs[data-v-294ca5e6]{\n      background-color: #f4f4f4;\n      padding-bottom: 1000px;\n      margin-bottom: -1000px;\n}\n.scroller[data-v-294ca5e6]{\n      margin-bottom: 90px;\n}\n.ml-ipx[data-v-294ca5e6]{\n      margin-bottom: 140px;\n}\n.cell-button[data-v-294ca5e6]{\n      margin-bottom: 18px;\n}\n.header[data-v-294ca5e6]{\n      height: 380px;\n}\n.h-ipx[data-v-294ca5e6]{\n      height: 420px;\n}\n.header-bg[data-v-294ca5e6]{\n      position: absolute;\n      top:0;\n      left: 0;\n      right: 0;\n      height: 500px;\n      width: 750px;\n}\n.bg2[data-v-294ca5e6]{\n      top:500px;\n}\n.bg3[data-v-294ca5e6]{\n      top:1000px;\n}\n.i-photo[data-v-294ca5e6]{\n      position: absolute;\n      bottom:60px;\n      left: 30px;\n      height: 130px;\n      width: 130px;\n      border-radius: 130px;\n}\n.i-name[data-v-294ca5e6]{\n      position: absolute;\n      bottom:120px;\n      left: 190px;\n      height: 50px;\n      width: 300px;\n      font-size: 38px;\n      color:#fff;\n}\n.b-tlt[data-v-294ca5e6]{\n      position: absolute;\n      bottom: 70px;\n      left: 190px;\n      height: 40px;\n      width: 350px;\n      display: flex;\n      flex-direction: row;\n      flex-wrap: nowrap;\n}\n.i-tag[data-v-294ca5e6]{\n      width: 30px;\n      height: 30px;\n      font-size: 24px;\n      padding-top: 2px;\n      margin-right: 6px;\n      border-radius: 4px;\n}\n.tag-e[data-v-294ca5e6]{\n      width: 32px;\n      height: 32px;\n}\n.tag-v8[data-v-294ca5e6]{\n      color:#fff;\n      background-color: #b29e75;\n      text-align: center;\n}\n.txt-tag[data-v-294ca5e6]{\n      color:#b4a078;\n      flex: 1;\n      height: 40px;\n      font-size: 28px;\n      overflow: hidden;\n      lines:1;\n      text-overflow: ellipsis;\n}\n.b-qrcode[data-v-294ca5e6]{\n      position: absolute;\n      bottom:80px;\n      right: 40px;\n      height: 80px;\n      width: 80px;\n      border-radius: 70px;\n      text-align: center;\n      font-size: 40px;\n      padding-top: 18px;\n      color:#fff;\n      background-color: rgba(255,255,255,.3);\n}\n.s-box[data-v-294ca5e6]{\n      padding-left: 26px;\n      background-color: #fff;\n}\n.box-tlt[data-v-294ca5e6]{\n      height: 94px;\n}\n.box-txt[data-v-294ca5e6]{\n      font-size: 26px;\n      padding-top: 34px;\n      color:#333;\n}\n.i-box-in[data-v-294ca5e6]{\n      position: absolute;\n      top:34px;\n      right: 30px;\n      color:#333;\n}\n.box-line[data-v-294ca5e6]{\n      height: 132px;\n      display: flex;\n      padding-right: 30px;\n      flex-wrap: nowrap;\n      flex-direction: row;\n      justify-content: space-between;\n}\n.i-box-l[data-v-294ca5e6]{\n      width: 130px;\n      height: 132px;\n}\n.i-box-icon[data-v-294ca5e6]{\n      font-size: 50px;\n      text-align: center;\n      padding-top: 15px;\n      height:79px;\n      padding-bottom: 10px;\n      color:#666;\n}\n.i-box-tlt[data-v-294ca5e6]{\n      font-size: 26px;\n      text-align: center;\n      color:#666;\n}\n.line-serve[data-v-294ca5e6]{\n      padding-top: 20px;\n      height: 150px;\n}\n.border-bottom[data-v-294ca5e6]{\n      border-bottom-width: 1px;\n      border-bottom-color: rgba(0,0,0,.15) ;\n}\n.i-c-orange[data-v-294ca5e6]{\n      color:#ff744d;\n}\n.i-c-yellow[data-v-294ca5e6]{\n      color:#f6a121;\n}\n.i-c-blue[data-v-294ca5e6]{\n      color:#689de5;\n}\n", ""]);

// exports


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.label_out[data-v-4df57bad]{\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: center\n}\n.label_out_text[data-v-4df57bad]{\r\n    width: 220px;\r\n    font-size: 28px\n}\n.personal_out[data-v-4df57bad]{\r\n    justify-content: center;\r\n    align-items: center;\r\n    width: 750px;\n}\n.personal_center[data-v-4df57bad]{\r\n    width: 750px;\r\n    border-top-color:#E2E2E2;\r\n    border-top-width: 1px;\n}\n.personal_info[data-v-4df57bad]{\r\n    width: 750px;\r\n    margin-top: 20px;\r\n    margin-bottom: 200px\n}\n.phone_image[data-v-4df57bad]{\r\n    width: 40px;\r\n    height: 40px;\r\n    margin-right: 20px;\n}\r\n", ""]);

// exports


/***/ }),
/* 193 */,
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.hint_out[data-v-4fdf6165]{\r\n     width: 650px;  \r\n    justify-content: flex-start;\n}\n.hint_text[data-v-4fdf6165]{\r\n  font-size: 25px;\r\n  color:#BCC1C4;\n}\n.login_header[data-v-4fdf6165]{\r\n    margin-top: 120px;\n}\n.register_footer[data-v-4fdf6165]{\r\n    width:100%;\r\n    position:fixed;\r\n    bottom:30px;\r\n    text-align:center\n}\n.btn_register[data-v-4fdf6165]{\r\n    background-color:#ffe45f;\r\n    margin-top: 50px\n}\n.register_out[data-v-4fdf6165] {\r\n    align-items: center;\r\n    justify-content: center;\r\n    margin-top: 100px;\n}\n.bb8_logo[data-v-4fdf6165]{\r\n    width:450px;\r\n    height: 102px;\r\n    margin-top:150px;\r\n    margin-bottom: 150px;\n}\n.register_title[data-v-4fdf6165]{\r\n    padding-top: 30px;\r\n    margin-bottom: 100px\n}\n.input_wrapper[data-v-4fdf6165]{  \r\n    width: 650px;  \r\n    margin-left: 100px;  \r\n    margin-right: 100px;  \r\n    margin-bottom: 40px;\n}\n.send_code_out[data-v-4fdf6165]{\r\n    flex-direction: row;\r\n    justify-content: space-around;\n}\n.input_code_out[data-v-4fdf6165]{  \r\n    width: 450px;  \r\n    margin-right: 30px;\n}\n.input_code_btn[data-v-4fdf6165]{  \r\n    width: 170px;  \r\n    text-align: center\n}\n.input[data-v-4fdf6165] {  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    padding-left: 70px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;  \r\n    font-size: 28px;\r\n    placeholder-color:#c2c2c2\n}\n.input_code[data-v-4fdf6165] {  \r\n    height: 85px;  \r\n    width: 450px;  \r\n    padding-left: 70px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;  \r\n    font-size: 28px;\r\n    placeholder-color:#c2c2c2\n}\n.input_img[data-v-4fdf6165]{  \r\n    position: absolute;  \r\n    top:21px;  \r\n    left: 18px;  \r\n    width:40px;  \r\n    height: 40px;\n}\n.input_register[data-v-4fdf6165]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    border-radius: 10px;  \r\n    margin-top: 60px;  \r\n    background-color: #ffe45f;\n}\n.input_register[data-v-4fdf6165]:active{  \r\n    background-color: #FFED93;\n}\n.input_register_text[data-v-4fdf6165]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    text-align: center;  \r\n    line-height: 85px;  \r\n    font-size: 30px\n}\n.register_text[data-v-4fdf6165]{\r\n    font-size: 30px\n}\n.send_code[data-v-4fdf6165]{\r\n    border-radius: 10px;  \r\n    height: 85px;  \r\n    line-height: 85px; \r\n    width: 170px ;\r\n    text-align: center;\r\n    padding: 0 10px;\r\n    font-size: 30px\n}\n.input_forget[data-v-4fdf6165]{  \r\n    position: absolute;  \r\n    left: 30px;\n}  \r\n", ""]);

// exports


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.close_content[data-v-6766af5c]{\n    position: absolute;\n    left: 40px;\n    width: 60px;\n    height: 60px;\n    top:100px\n}\n.wrapper[data-v-6766af5c]{\n    position: absolute;\n    left: 0;\n    right:0;\n    bottom: 0;\n    top:0;\n}\n.iconfont[data-v-6766af5c] {\n    font-family:iconfont;\n}\n.toolbar[data-v-6766af5c]{\n    position: fixed;\n    top: 0;\n    left: 0;right: 0;\n    height: 114px;\n    padding-top: 44px;\n    background-color: #fafafa;\n    opacity: .99;\n    z-index: 101;\n    flex-wrap: nowrap;\n    flex-direction: row;\n    justify-content: space-around;\n    border-bottom-width: 1px;\n    border-bottom-color: #d9d9d9;\n}\n.t-ipx[data-v-6766af5c]{\n    height: 154px;\n    padding-top: 84px;\n}\n.tlt[data-v-6766af5c]{\n    flex: 1;\n    font-size: 36px;\n    padding-top: 10px;\n    color:#333;\n    text-align: center;\n}\n.left[data-v-6766af5c],.right[data-v-6766af5c]{\n    height: 68px;\n    width: 150px;\n    padding-top:10px;\n    display: flex;\n    flex-direction: row;\n    flex-wrap: nowrap;\n    justify-content: center;\n}\n.left[data-v-6766af5c]{\n    justify-content: flex-start;\n    padding-left: 20px;\n}\n.right[data-v-6766af5c]{\n    justify-content: flex-end;\n    padding-right: 20px;\n}\n.btnTxt[data-v-6766af5c]{\n    font-size: 40px;\n    width: 70px;\n    color:#666;\n\n    text-align: center;\n}\n.webview-box[data-v-6766af5c] {\n    position: absolute;\n    width: 750px;\n    top: 124px ;\n    left: 0;\n    right:0;\n    bottom: 0;\n}\n.web-ipx[data-v-6766af5c]{\n    top:164px;\n}\n.webview[data-v-6766af5c]{\n    position: absolute;\n    width: 750px;\n    top: 0 ;\n    left: 0;\n    right:0;\n    bottom: 0;\n}\n\n", ""]);

// exports


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.hint_out[data-v-6b0aecc0]{\r\n     width: 650px;  \r\n    justify-content: flex-start;\n}\n.hint_out_top[data-v-6b0aecc0]{\r\n     width: 650px;  \r\n    justify-content: flex-start;\r\n    margin-bottom: 30px;\n}\n.hint_text[data-v-6b0aecc0]{\r\n  font-size: 25px;\r\n  color:#BCC1C4;\n}\n.hint_pwdlogin[data-v-6b0aecc0]{\r\n  font-size: 30px;\n}\n.login_header[data-v-6b0aecc0]{\r\n    margin-top: 120px;\n}\n.register_footer[data-v-6b0aecc0]{\r\n    width:100%;\r\n    position:fixed;\r\n    bottom:30px;\r\n    text-align:center\n}\n.btn_register[data-v-6b0aecc0]{\r\n    background-color:#ffe45f;\r\n    margin-top: 50px\n}\n.register_out[data-v-6b0aecc0] {\r\n    align-items: center;\r\n    justify-content: center;\r\n    margin-top: 80px;\n}\n.bb8_logo[data-v-6b0aecc0]{\r\n    width:450px;\r\n    height: 102px;\r\n    margin-top:150px;\r\n    margin-bottom: 150px;\n}\n.register_title[data-v-6b0aecc0]{\r\n    padding-top: 30px;\r\n    margin-bottom: 100px\n}\n.input_wrapper[data-v-6b0aecc0]{  \r\n    width: 650px;  \r\n    margin-left: 100px;  \r\n    margin-right: 100px;  \r\n    margin-bottom: 40px;\n}\n.send_code_out[data-v-6b0aecc0]{\r\n    flex-direction: row;\r\n    justify-content: space-around;\n}\n.input_code_out[data-v-6b0aecc0]{  \r\n    width: 450px;  \r\n    margin-right: 30px;\n}\n.input_code_btn[data-v-6b0aecc0]{  \r\n    width: 170px;  \r\n    text-align: center\n}\n.input[data-v-6b0aecc0] {  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    padding-left: 70px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;  \r\n    font-size: 28px;\r\n    placeholder-color:#c2c2c2\n}\n.input_code[data-v-6b0aecc0] {  \r\n    height: 85px;  \r\n    width: 450px;  \r\n    padding-left: 70px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;  \r\n    font-size: 28px;\r\n    placeholder-color:#c2c2c2\n}\n.input_img[data-v-6b0aecc0]{  \r\n    position: absolute;  \r\n    top:21px;  \r\n    left: 18px;  \r\n    width:40px;  \r\n    height: 40px;\n}\n.input_register[data-v-6b0aecc0]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    border-radius: 10px;  \r\n    margin-top: 60px;  \r\n    background-color: #ffe45f;\n}\n.input_register[data-v-6b0aecc0]:active{  \r\n    background-color: #FFED93;\n}\n.input_register_text[data-v-6b0aecc0]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    text-align: center;  \r\n    line-height: 85px;  \r\n    font-size: 30px\n}\n.register_text[data-v-6b0aecc0]{\r\n    font-size: 30px\n}\n.send_code[data-v-6b0aecc0]{\r\n    border-radius: 10px;  \r\n    height: 85px;  \r\n    line-height: 85px; \r\n    width: 170px ;\r\n    text-align: center;\r\n    padding: 0 10px;\r\n    font-size: 28px\n}\n.input_forget[data-v-6b0aecc0]{  \r\n    position: absolute;  \r\n    left: 30px;\n}  \r\n", ""]);

// exports


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.cell_login[data-v-6be20be2]{\r\n    font-size: 40px\n}\n.personal_info[data-v-6be20be2]{\r\n    width: 750px;\r\n    margin-top: 20px;\r\n    margin-bottom: 200px\n}\n.phone_image[data-v-6be20be2]{\r\n    width: 50px;\r\n    height: 50px;\r\n    margin-right: 20px;\n}\n.default_image[data-v-6be20be2]{\r\n    width: 90px;\r\n    height: 90px;\r\n    margin-right: 30px;\n}\n.personal_center[data-v-6be20be2]{\r\n    width: 750px;\r\n    border-top-color:#E2E2E2;\r\n    border-top-width: 1px;\n}\n.exit_btn_out[data-v-6be20be2]{\r\n    padding-top: 10px;\r\n    padding-bottom: 10px;\r\n    padding-right: 20px;\r\n    padding-left: 20px;\r\n    border-radius: 10px;  \r\n    margin-top: 15px;\r\n    border-color:#000000;\r\n    border-width: 1px;\n}\n.exit_btn[data-v-6be20be2]{\r\n    font-size: 30px\n}\n.user_name[data-v-6be20be2]{\r\n    font-size: 30px;\r\n    margin-top: 15px\n}\n.personal_header[data-v-6be20be2]{\r\n    width: 750px;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n   padding-top: 80px;\r\n   padding-bottom: 80px;\n}\n.personal_out[data-v-6be20be2]{\r\n     width: 750px;\r\n    justify-content: center;\r\n    align-items: center;\n}\n.user_logo[data-v-6be20be2]{\r\n    width:120px;\r\n    height: 120px;\n}\r\n\r\n", ""]);

// exports


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.small_text[data-v-79d5601c]{\r\n    font-size: 24px\n}\n.login_footer_default[data-v-79d5601c]{\r\n    width:750px;\r\n    position:fixed;\r\n    bottom:50px;\r\n    left: 0;right: 0;\r\n    z-index: 10;\r\n    text-align:center;\r\n    font-size: 18px;\n}\n.login_footer[data-v-79d5601c]{\r\n    width:750px;\r\n    position:fixed;\r\n    bottom:150px;\r\n    left: 0;right: 0;\r\n    z-index: 10;\r\n    text-align:center;\r\n    font-size: 18px;\n}\n.btn_login[data-v-79d5601c]{\r\n    background-color:#ffe45f;\r\n    margin-top: 50px\n}\n.login_out[data-v-79d5601c] {\r\n    width:750px;\r\n    align-items: center;\r\n    justify-content: center;\r\n    margin-top: 50px;\n}\n.bb8_logo[data-v-79d5601c]{\r\n    width:120px;\r\n    height: 58px;\r\n    margin-top:120px;\r\n    margin-bottom: 160px;\n}\n.default_bb8_logo[data-v-79d5601c]{\r\n    width:120px;\r\n    height: 58px;\r\n    margin-top:100px;\r\n    margin-bottom: 130px;\n}\n.login_bb8[data-v-79d5601c]{\r\n   width: 240px;\r\n   height: 50px;\n}\n.login_title[data-v-79d5601c]{\r\n    padding-top: 30px\n}\n.input_wrapper[data-v-79d5601c]{  \r\n    width: 650px;  \r\n    margin-left: 100px;  \r\n    margin-right: 100px;  \r\n    margin-bottom: 40px;\n}\n.android_input_wrapper[data-v-79d5601c]{\r\n    width: 650px;  \r\n    margin-left: 100px;  \r\n    margin-right: 100px;  \r\n    margin-bottom: 40px;  \r\n    flex-direction:row;\r\n    justify-content:space-between;\n}\n.input[data-v-79d5601c] {  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    padding-left: 70px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;  \r\n    font-size: 28px;\r\n    placeholder-color:#c2c2c2\n}\n.input_img[data-v-79d5601c]{  \r\n    position: absolute;  \r\n    top:21px;  \r\n    left: 18px;  \r\n    width:40px;  \r\n    height: 40px;\n}\n.input_login[data-v-79d5601c]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    border-radius: 10px;  \r\n    margin-top: 80px;  \r\n    background-color: #ffe45f;\n}\n.input_login[data-v-79d5601c]:active{  \r\n    background-color: #FFED93;\n}\n.input_login_text[data-v-79d5601c]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    text-align: center;  \r\n    line-height: 85px;  \r\n    font-size: 30px\n}\n.login_text[data-v-79d5601c]{\r\n    font-size: 30px\n}\n.input_forget[data-v-79d5601c]{  \r\n    position: absolute;  \r\n    left: 30px;\n}\n.input_register_out[data-v-79d5601c]{\r\n    position: absolute;  \r\n    left: 10px;  \r\n    height:40px;\r\n    font-size: 24px;\n}\n.input_fastlogin_out[data-v-79d5601c]{\r\n    position: absolute;  \r\n    right: 10px;  \r\n    height:40px;\r\n    font-size: 24px;\n}\n.input_register[data-v-79d5601c]{\r\n\r\n    font-size: 30px;\n}\n.register_out[data-v-79d5601c]{\r\n   flex-direction:row;\r\n   justify-content:center;\n}\n.footer_out[data-v-79d5601c]{\r\n   flex-direction:row;\r\n   justify-content:center;\r\n   width: 750px;\r\n   height: 40px;\n}\n.login_bb8_out[data-v-79d5601c]{\r\n   flex-direction:row;\r\n   justify-content:center;\r\n   margin-bottom: 50px;\n}\r\n", ""]);

// exports


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.login_text[data-v-7f9f167e]{\r\n    font-size: 35px\n}\n.footer_null[data-v-7f9f167e]{\r\n    height: 60px;\n}\n.footer_android[data-v-7f9f167e]{\n}\n.label_out[data-v-7f9f167e]{\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n    width: 750px;\n}\n.label_out_more[data-v-7f9f167e]{\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: center;\n}\n.label_out_text[data-v-7f9f167e]{\r\n    width: 220px;\r\n    font-size: 27px\n}\n.my_module_out[data-v-7f9f167e]{\r\n    width: 750px;\r\n    background-color: white;\r\n    justify-content: center;\r\n    align-items: center;\n}\n.my_module_content[data-v-7f9f167e]{\r\n    width: 600px;\r\n    flex-direction: row;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    background-color: white;\r\n    padding-top: 50px;\r\n    padding-bottom: 50px;\n}\n.module_item[data-v-7f9f167e]{\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n    align-content: center\n}\n.module_image[data-v-7f9f167e]{\r\n    width: 50px;\r\n    height: 50px;\n}\n.line_gary[data-v-7f9f167e]{\r\n    width: 500px;\r\n    height: 1px;\r\n    background-color: gray\n}\n.cell_login[data-v-7f9f167e]{\r\n    font-size: 40px\n}\n.personal_info[data-v-7f9f167e]{\r\n    width: 750px;\r\n    margin-top: 20px;\r\n    margin-bottom: 200px\n}\n.android_personal_info[data-v-7f9f167e]{\r\n    width: 750px;\r\n    margin-top: 20px;\r\n    margin-bottom: 20px\n}\n.phone_image[data-v-7f9f167e]{\r\n    width: 40px;\r\n    height: 40px;\r\n    margin-right: 20px;\n}\n.default_image[data-v-7f9f167e]{\r\n    width: 90px;\r\n    height: 90px;\r\n    margin-right: 30px;\n}\n.personal_center[data-v-7f9f167e]{\r\n    width: 750px;\r\n    border-top-color:#E2E2E2;\r\n    border-top-width: 1px;\n}\n.contact_us[data-v-7f9f167e]{\r\n    width: 750px;\r\n    border-top-color:#E2E2E2;\r\n    border-top-width: 1px;\r\n    margin-top: 20px\n}\n.exit_btn_out[data-v-7f9f167e]{\r\n    padding-top: 10px;\r\n    padding-bottom: 10px;\r\n    padding-right: 20px;\r\n    padding-left: 20px;\r\n    border-radius: 10px;  \r\n    margin-top: 15px;\r\n    border-color:#000000;\r\n    border-width: 1px;\n}\n.exit_btn_out[data-v-7f9f167e]:active{\r\n    background-color: #F5F5F5;\n}\n.exit_btn[data-v-7f9f167e]{\r\n    font-size: 30px;\r\n    margin-top: 10px\n}\n.user_name[data-v-7f9f167e]{\r\n    font-size: 30px;\r\n    margin-top: 15px\n}\n.personal_header[data-v-7f9f167e]{\r\n    width: 750px;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n    padding-top: 80px;\r\n    padding-bottom: 50px;\n}\n.personal_out[data-v-7f9f167e]{\r\n     width: 750px;\r\n    justify-content: center;\r\n    align-items: center;\n}\n.user_logo[data-v-7f9f167e]{\r\n    width:120px;\r\n    height: 120px;\n}\n.desc_text[data-v-7f9f167e]{\r\n   flex: 1;\r\n   color: gray;\r\n   font-size: 24px;\r\n   text-align: right;\r\n   padding-right: 50px\n}\r\n", ""]);

// exports


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.main_out[data-v-7fe16f48]{\r\n    width: 750px;\r\n    border-top-color:#E2E2E2;\r\n    border-top-width: 1px;\n}\n.main_centent[data-v-7fe16f48]{\r\n    padding-top:20px;\r\n    padding-left:40px;\r\n    padding-right:30px\n}\n.text_one[data-v-7fe16f48]{\r\n    color:#3a3a3a;\r\n    font-size: 28px;\r\n    line-height: 55px;\n}\n.phone_image[data-v-7fe16f48]{\r\n    width: 55px;\r\n    height: 55px;\r\n    margin-right: 20px;\n}\n.default_image[data-v-7fe16f48]{\r\n    width: 90px;\r\n    height: 90px;\r\n    margin-right: 30px;\n}\n.personal_center[data-v-7fe16f48]{\r\n    width: 750px;\r\n    border-top-color:#E2E2E2;\r\n    border-top-width: 1px;\n}\n.exit_btn_out[data-v-7fe16f48]{\r\n    padding-top: 10px;\r\n    padding-bottom: 10px;\r\n    padding-right: 20px;\r\n    padding-left: 20px;\r\n    border-radius: 10px;  \r\n    margin-top: 15px;\r\n    border-color:#000000;\r\n    border-width: 1px;\n}\n.exit_btn[data-v-7fe16f48]{\r\n    font-size: 30px\n}\n.user_name[data-v-7fe16f48]{\r\n    font-size: 30px;\r\n    margin-top: 15px\n}\n.personal_header[data-v-7fe16f48]{\r\n    width: 750px;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n   padding-top: 80px;\r\n   padding-bottom: 80px;\n}\n.personal_out[data-v-7fe16f48]{\r\n    justify-content: center;\r\n    align-items: center;\n}\n.user_logo[data-v-7fe16f48]{\r\n    width:120px;\r\n    height: 120px;\n}\r\n\r\n", ""]);

// exports


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.login_header[data-v-b7e71980]{\r\n    margin-top: 120px;\n}\n.register_footer[data-v-b7e71980]{\r\n    width:100%;\r\n    position:fixed;\r\n    bottom:30px;\r\n    text-align:center\n}\n.btn_register[data-v-b7e71980]{\r\n    background-color:#ffe45f;\r\n    margin-top: 50px\n}\n.register_out[data-v-b7e71980] {\r\n    align-items: center;\r\n    justify-content: center;\r\n    margin-top: 100px;\n}\n.bb8_logo[data-v-b7e71980]{\r\n    width:450px;\r\n    height: 102px;\r\n    margin-top:150px;\r\n    margin-bottom: 150px;\n}\n.register_title[data-v-b7e71980]{\r\n    padding-top: 30px;\r\n    margin-bottom: 100px\n}\n.input_wrapper[data-v-b7e71980]{  \r\n    width: 650px;  \r\n    margin-left: 100px;  \r\n    margin-right: 100px;  \r\n    margin-bottom: 40px;\n}\n.send_code_out[data-v-b7e71980]{\r\n    flex-direction: row;\r\n    justify-content: space-around;\n}\n.input_code_out[data-v-b7e71980]{  \r\n    width: 450px;  \r\n    margin-right: 30px;\n}\n.input_code_btn[data-v-b7e71980]{  \r\n    width: 170px;  \r\n    text-align: center\n}\n.input[data-v-b7e71980] {  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    padding-left: 70px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;  \r\n    font-size: 28px;\r\n    placeholder-color:#c2c2c2\n}\n.input_code[data-v-b7e71980] {  \r\n    height: 85px;  \r\n    width: 450px;  \r\n    padding-left: 70px;  \r\n    padding-top: 15px;  \r\n    padding-bottom: 15px;  \r\n    border-color: #eeeeef;  \r\n    border-radius:10px;  \r\n    outline: none;  \r\n    font-size: 28px;\r\n    placeholder-color:#c2c2c2\n}\n.input_img[data-v-b7e71980]{  \r\n    position: absolute;  \r\n    top:21px;  \r\n    left: 18px;  \r\n    width:40px;  \r\n    height: 40px;\n}\n.input_register[data-v-b7e71980]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    border-radius: 10px;  \r\n    margin-top: 60px;  \r\n    background-color: #ffe45f;\n}\n.input_register[data-v-b7e71980]:active{  \r\n    background-color: #FFED93;\n}\n.input_register_text[data-v-b7e71980]{  \r\n    height: 85px;  \r\n    width: 650px;  \r\n    text-align: center;  \r\n    line-height: 85px;  \r\n    font-size: 30px\n}\n.register_text[data-v-b7e71980]{\r\n    font-size: 30px\n}\n.send_code[data-v-b7e71980]{\r\n    border-radius: 10px;  \r\n    height: 85px;  \r\n    line-height: 85px; \r\n    width: 170px ;\r\n    text-align: center;\r\n    padding: 0 10px;\r\n    font-size: 28px\n}\n.input_forget[data-v-b7e71980]{  \r\n    position: absolute;  \r\n    left: 30px;\n}  \r\n\r\n", ""]);

// exports


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.toolbar_img[data-v-c92751cc]{\n        width: 40px;\n        height: 40px;\n}\n.toolbar_text[data-v-c92751cc]{\n        font-size: 40px;\n        color: white\n}\n.about_out[data-v-c92751cc]{\n   width: 750px;\n   justify-content: center;\n   align-items: center;\n}\n.null_logo[data-v-c92751cc]{\n    width:150px;\n    height: 150px;\n    margin-top:120px;\n    margin-bottom: 100px;\n}\n.main_centent[data-v-c92751cc]{\n    padding-top:20px;\n    padding-left:40px;\n    padding-right:30px\n}\n.text_one[data-v-c92751cc]{\n    color:#3a3a3a;\n    font-size: 28px;\n    line-height: 55px;\n}\n.phone_image[data-v-c92751cc]{\n    width: 55px;\n    height: 55px;\n    margin-right: 20px;\n}\n.default_image[data-v-c92751cc]{\n    width: 90px;\n    height: 90px;\n    margin-right: 30px;\n}\n.personal_center[data-v-c92751cc]{\n    width: 750px;\n    border-top-color:#E2E2E2;\n    border-top-width: 1px;\n}\n.exit_btn_out[data-v-c92751cc]{\n    padding-top: 10px;\n    padding-bottom: 10px;\n    padding-right: 20px;\n    padding-left: 20px;\n    border-radius: 10px;  \n    margin-top: 15px;\n    border-color:#000000;\n    border-width: 1px;\n}\n.exit_btn[data-v-c92751cc]{\n    font-size: 30px\n}\n.user_name[data-v-c92751cc]{\n    font-size: 30px;\n    margin-top: 15px\n}\n.personal_header[data-v-c92751cc]{\n    width: 750px;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n   padding-top: 80px;\n   padding-bottom: 80px;\n}\n.personal_out[data-v-c92751cc]{\n    justify-content: center;\n    align-items: center;\n}\n.user_logo[data-v-c92751cc]{\n    width:120px;\n    height: 120px;\n}\n\n", ""]);

// exports


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.iconfont[data-v-f57a2d20] {\n    font-family:iconfont;\n}\n.wrapper[data-v-f57a2d20]{\n    position: fixed;\n    bottom: 0;\n    left: 0;right: 0;\n    height: 90px;\n    flex-wrap: nowrap;\n    flex-direction: row;\n    justify-content: space-around;\n    border-top-width: 1px;\n    border-top-color: #d9d9d9;\n    background-color: #fafafa;\n}\n.w-ipx[data-v-f57a2d20]{\n    height: 140px;\n}\n.bar-item[data-v-f57a2d20]{\n    flex: 1;\n}\n.bar-txt[data-v-f57a2d20],.bar-ic[data-v-f57a2d20]{\n    color:#666;\n    text-align: center;\n}\n.bar-active[data-v-f57a2d20]{\n    color:#b4282d;\n}\n.bar-ic[data-v-f57a2d20]{\n    padding-top: 14px;\n    font-size: 38px;\n}\n.bar-txt[data-v-f57a2d20]{\n    font-size: 22px;\n    padding-top: 2px;\n}\n.i-notice[data-v-f57a2d20]{\n    position: absolute;\n    top:10px;\n    right: 30px;\n    height: 30px;\n    width: 30px;\n    border-radius: 100%;\n    font-size: 26px;\n    line-height: 30px;\n    text-align: center;\n    color: #fff;\n    background-color: #f00;\n}\n.notice-dot[data-v-f57a2d20]{\n    position: absolute;\n    top:15px;\n    right: 40px;\n    height: 15px;\n    width: 15px;\n    border-radius: 100%;\n    background-color: #f00;\n}\n", ""]);

// exports


/***/ }),
/* 212 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_1a7e9f9e_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(215);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(236)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1a7e9f9e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_index_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_1a7e9f9e_hasScoped_true_buble_transforms_vue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/weex-ui/packages/wxc-popover/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1a7e9f9e", Component.options)
  } else {
    hotAPI.reload("data-v-1a7e9f9e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 213 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_white" },
    [
      _c(
        "scroller",
        [
          _c("loginHeader", { attrs: { data: _vm.data } }),
          _vm._v(" "),
          _c("div", { staticClass: "main_out" }, [
            _c("div", { staticClass: "main_centent" }, [
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.titleone))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.titletwo))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textone))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.texttwo))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textthree))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textfour))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textfive))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textsix))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textseven))
              ])
            ])
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-000bae73", esExports)
  }
}

/***/ }),
/* 214 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_white" },
    [
      _c("loginHeader", { attrs: { data: _vm.data } }),
      _vm._v(" "),
      _c("div", { staticClass: "register_out bg_white" }, [
        _c("div", { staticClass: "input_wrapper" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.userPwd,
                expression: "userPwd"
              }
            ],
            staticClass: "input bg_gray",
            attrs: {
              type: "password",
              placeholder: "设置登录密码，6-16个字符，字母和数字组合",
              value: ""
            },
            domProps: { value: _vm.userPwd },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.userPwd = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("image", {
            staticClass: "input_img",
            attrs: { src: _vm.get_img_path("password.png") }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.nextUserPwd,
                expression: "nextUserPwd"
              }
            ],
            staticClass: "input bg_gray",
            attrs: { type: "password", placeholder: "确认登录密码", value: "" },
            domProps: { value: _vm.nextUserPwd },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.nextUserPwd = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("image", {
            staticClass: "input_img",
            attrs: { src: _vm.get_img_path("password.png") }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper" }, [
          _c(
            "div",
            {
              staticClass: "input_register",
              on: {
                click: function($event) {
                  return _vm.getModifyPwd()
                }
              }
            },
            [
              _c("text", { staticClass: "input_register_text color1" }, [
                _vm._v("确定")
              ])
            ]
          )
        ])
      ]),
      _vm._v(" "),
      _c("wxc-loading", {
        attrs: {
          show: _vm.isShowLoad,
          type: _vm.type,
          "loading-text": _vm.loadingText,
          interval: _vm.interval
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-10c1e354", esExports)
  }
}

/***/ }),
/* 215 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _vm.show
      ? _c("div", {
          staticClass: "g-cover",
          style: _vm.coverStyle,
          on: {
            touchend: function($event) {
              _vm.show = false
            }
          }
        })
      : _vm._e(),
    _vm._v(" "),
    _vm.show && _vm.buttons
      ? _c(
          "div",
          {
            ref: "wxc-popover",
            staticClass: "wxc-popover",
            style: _vm.contentStyle
          },
          [
            _c("div", {
              staticClass: "u-popover-arrow",
              style: _vm.arrowStyle
            }),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "u-popover-inner" },
              _vm._l(_vm.buttons, function(item, i) {
                return _c(
                  "div",
                  {
                    key: i,
                    class: ["i-btn", i == 0 ? "i-btn-noborder" : ""],
                    on: {
                      click: function($event) {
                        return _vm.wxcButtonClicked(i, item.key)
                      }
                    }
                  },
                  [
                    item.icon
                      ? _c("image", {
                          staticClass: "btn-icon",
                          attrs: { src: item.icon }
                        })
                      : _vm._e(),
                    _vm._v(" "),
                    _c("text", { staticClass: "btn-text" }, [
                      _vm._v(_vm._s(item.text))
                    ])
                  ]
                )
              }),
              0
            )
          ]
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1a7e9f9e", esExports)
  }
}

/***/ }),
/* 216 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_white" },
    [
      _c("loginHeader", { attrs: { data: _vm.data } }),
      _vm._v(" "),
      _c("div", { staticClass: "register_out bg_white" }, [
        _c("div", { staticClass: "input_wrapper" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.mobileNo,
                expression: "mobileNo"
              }
            ],
            staticClass: "input bg_gray",
            attrs: {
              type: "text",
              placeholder: "请输入手机号/邮箱",
              value: ""
            },
            domProps: { value: _vm.mobileNo },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.mobileNo = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("image", {
            staticClass: "input_img",
            attrs: { src: _vm.get_img_path("mobile.png") }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper send_code_out" }, [
          _c("div", { staticClass: "input_code_out" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.vCode,
                  expression: "vCode"
                }
              ],
              staticClass: "input_code bg_gray",
              attrs: {
                type: "nubmer",
                placeholder: "请输入手机/邮箱验证码",
                value: ""
              },
              domProps: { value: _vm.vCode },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.vCode = $event.target.value
                }
              }
            }),
            _vm._v(" "),
            _c("image", {
              staticClass: "input_img",
              attrs: { src: _vm.get_img_path("correct.png") }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "input_code_btn" }, [
            _c(
              "text",
              {
                staticClass: "send_code",
                class: [
                  _vm.datatime.judgetime ? "send_btn_on" : "send_btn_off"
                ],
                on: {
                  click: function($event) {
                    return _vm.sendCode()
                  }
                }
              },
              [_vm._v(_vm._s(_vm.datatime.timetext))]
            )
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "hint_out" }, [
          _c("text", { staticClass: "hint_text" }, [
            _vm._v("提示：输入验证码后，重新设置登录密码")
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper" }, [
          _c(
            "div",
            {
              staticClass: "input_register",
              on: {
                click: function($event) {
                  return _vm.goModifyPwd()
                }
              }
            },
            [
              _c("text", { staticClass: "input_register_text color1" }, [
                _vm._v("下一步")
              ])
            ]
          )
        ])
      ]),
      _vm._v(" "),
      _c("wxc-loading", {
        attrs: {
          show: _vm.isShowLoad,
          type: _vm.type,
          "loading-text": _vm.loadingText,
          interval: _vm.interval
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-214f1168", esExports)
  }
}

/***/ }),
/* 217 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "main_out" },
    [
      _c(
        "wxc-minibar",
        {
          attrs: {
            "background-color": _vm.getMainColor(),
            "text-color": "#FFFFFF",
            "left-button": _vm.leftButton
          },
          on: { wxcMinibarLeftButtonClicked: _vm.minibarLeftButtonClick }
        },
        [
          _c("div", { attrs: { slot: "left" }, slot: "left" }),
          _vm._v(" "),
          _c(
            "text",
            {
              staticStyle: { "font-size": "37px", color: "white" },
              attrs: { slot: "middle" },
              slot: "middle"
            },
            [_vm._v("地推")]
          ),
          _vm._v(" "),
          _c("image", {
            staticStyle: { height: "50px", width: "50px" },
            attrs: { slot: "right", src: _vm.get_img_path("me.png") },
            on: {
              click: function($event) {
                return _vm.goAboutUs()
              }
            },
            slot: "right"
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "main_content" }, [
        _c("div", { staticClass: "main_rows" }, [
          _c("div", { staticClass: "main_item" }, [
            _c("image", {
              staticClass: "item_image",
              attrs: { src: _vm.get_img_path("mer_inspection.png") }
            }),
            _vm._v(" "),
            _c("text", { staticClass: "item_text" }, [_vm._v("商户巡检")])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "main_item" }, [
            _c("image", {
              staticClass: "item_image",
              attrs: { src: _vm.get_img_path("mer_expand.png") }
            }),
            _vm._v(" "),
            _c("text", { staticClass: "item_text" }, [_vm._v("商户拓展")])
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "main_rows" }, [
          _c("div", { staticClass: "main_item" }, [
            _c("image", {
              staticClass: "item_image",
              attrs: { src: _vm.get_img_path("statis_report.png") }
            }),
            _vm._v(" "),
            _c("text", { staticClass: "item_text" }, [_vm._v("统计报告")])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "main_item" }, [
            _c("image", {
              staticClass: "item_image",
              attrs: { src: _vm.get_img_path("my_earn.png") }
            }),
            _vm._v(" "),
            _c("text", { staticClass: "item_text" }, [_vm._v("我的收益")])
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "main_rows" }, [
          _c("div", { staticClass: "main_item" }, [
            _c("image", {
              staticClass: "item_image",
              attrs: { src: _vm.get_img_path("work_locus.png") }
            }),
            _vm._v(" "),
            _c("text", { staticClass: "item_text" }, [_vm._v("工作轨迹")])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "main_item" }, [
            _c("image", {
              staticClass: "item_image",
              attrs: { src: _vm.get_img_path("plan_management.png") }
            }),
            _vm._v(" "),
            _c("text", { staticClass: "item_text" }, [_vm._v("计划管理")])
          ])
        ])
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "main_banners" },
        [
          _c(
            "slider",
            {
              staticClass: "slider size",
              attrs: { "auto-play": "true", interval: "3000" }
            },
            [
              _vm._l(_vm.posts, function(post) {
                return _c("div", [
                  _c("image", {
                    staticClass: "size",
                    attrs: { resize: "cover", src: post.pic },
                    on: { load: _vm.onload }
                  })
                ])
              }),
              _vm._v(" "),
              _c("indicator", { staticClass: "indicator" })
            ],
            2
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-285305fc", esExports)
  }
}

/***/ }),
/* 218 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper" },
    [
      _c("UserHeader"),
      _vm._v(" "),
      _c("image", {
        staticClass: "header-bg",
        attrs: {
          resize: "cover",
          src: "http://cdn.zwwill.com/yanxuan/imgs/bg5.png"
        }
      }),
      _vm._v(" "),
      _c("image", {
        staticClass: "header-bg bg2",
        attrs: {
          resize: "cover",
          src: "http://cdn.zwwill.com/yanxuan/imgs/bg5.png"
        }
      }),
      _vm._v(" "),
      _c("image", {
        staticClass: "header-bg bg3",
        attrs: {
          resize: "cover",
          src: "http://cdn.zwwill.com/yanxuan/imgs/bg5.png"
        }
      }),
      _vm._v(" "),
      _c(
        "scroller",
        {
          class: ["scroller", _vm.isIpx && _vm.isIpx() ? "ml-ipx" : ""],
          attrs: { "show-scrollbar": "false" }
        },
        [
          _c(
            "div",
            { class: ["header", _vm.isIpx && _vm.isIpx() ? "h-ipx" : ""] },
            [
              _c("image", {
                staticClass: "i-photo",
                attrs: {
                  resize: "cover",
                  src:
                    "http://yanxuan.nosdn.127.net/885e3901d0a3501362530435d76bebb3.jpg"
                }
              }),
              _vm._v(" "),
              _c("text", { staticClass: "i-name" }, [
                _vm._v(_vm._s(_vm.userId))
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "b-tlt" }, [
                _c("image", {
                  staticClass: "i-tag tag-e",
                  attrs: {
                    resize: "contain",
                    src:
                      "http://yanxuan.nosdn.127.net/3dc6e876620bb84a5dac3deb6ecd4916.png"
                  }
                }),
                _vm._v(" "),
                _c("text", { staticClass: "i-tag tag-v8 iconfont" }, [
                  _vm._v("")
                ]),
                _vm._v(" "),
                _c("text", { staticClass: "txt-tag" }, [
                  _vm._v("bb8智能投顾22")
                ]),
                _vm._v(" "),
                _c("image", {
                  staticStyle: { width: "50px", height: "50px" },
                  attrs: { resize: "cover", src: "/assets/images/b.png" }
                })
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "b-qrcode iconfont" }, [_vm._v("")])
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "fbs" }, [
            _c("div", { staticClass: "s-box cell-button" }, [
              _c("div", { staticClass: "box-tlt border-bottom" }, [
                _c("text", { staticClass: "box-txt" }, [_vm._v("我的订单")]),
                _c("text", { staticClass: "i-box-in iconfont" }, [_vm._v("")])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "box-line" }, [
                _c("div", { staticClass: "i-box-l" }, [
                  _c("text", { staticClass: "i-box-icon iconfont" }, [
                    _vm._v("")
                  ]),
                  _vm._v(" "),
                  _c("text", { staticClass: "i-box-tlt" }, [_vm._v("待付款")])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "i-box-l" }, [
                  _c("text", { staticClass: "i-box-icon iconfont" }, [
                    _vm._v("")
                  ]),
                  _vm._v(" "),
                  _c("text", { staticClass: "i-box-tlt" }, [_vm._v("待发货")])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "i-box-l" }, [
                  _c("text", { staticClass: "i-box-icon iconfont" }, [
                    _vm._v("")
                  ]),
                  _vm._v(" "),
                  _c("text", { staticClass: "i-box-tlt" }, [_vm._v("已发货")])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "i-box-l" }, [
                  _c("text", { staticClass: "i-box-icon iconfont" }, [
                    _vm._v("")
                  ]),
                  _vm._v(" "),
                  _c("text", { staticClass: "i-box-tlt" }, [_vm._v("待评价")])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "i-box-l" }, [
                  _c("text", { staticClass: "i-box-icon iconfont" }, [
                    _vm._v("")
                  ]),
                  _vm._v(" "),
                  _c("text", { staticClass: "i-box-tlt" }, [
                    _vm._v("退换/售后")
                  ])
                ])
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "s-box cell-button" }, [
              _c("div", { staticClass: "box-tlt border-bottom" }, [
                _c("text", { staticClass: "box-txt" }, [_vm._v("我的服务")])
              ]),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "box-line line-serve border-bottom",
                  on: {
                    click: function($event) {
                      return _vm.jumpWeb("https://id.163.com/gj/m/")
                    }
                  }
                },
                [
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-orange" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [
                      _vm._v("拼团订单")
                    ])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-yellow" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [
                      _vm._v("邀请好友")
                    ])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-orange" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [_vm._v("优惠券")])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-yellow" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [_vm._v("优先购")])
                  ])
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "box-line line-serve border-bottom",
                  on: {
                    click: function($event) {
                      return _vm.jumpWeb("https://gj.reg.163.com/faq/")
                    }
                  }
                },
                [
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-orange" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [_vm._v("礼品卡")])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-yellow" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [_vm._v("会员")])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-orange" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [_vm._v("足迹")])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-yellow" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [_vm._v("收藏")])
                  ])
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "box-line line-serve",
                  on: {
                    click: function($event) {
                      return _vm.jumpWeb(
                        "http%3A%2F%2Fm.you.163.com%2Fhelp%23%2F%3F_k%3Dyn4ucc"
                      )
                    }
                  }
                },
                [
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-blue" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [_vm._v("地址")])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-blue" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [_vm._v("客服")])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-blue" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [_vm._v("帮助")])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "i-box-l" }, [
                    _c(
                      "text",
                      { staticClass: "i-box-icon iconfont i-c-blue" },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [_vm._v("设置")])
                  ])
                ]
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "s-box cell-button" }, [
              _c("div", { staticClass: "box-tlt border-bottom" }, [
                _c(
                  "text",
                  { staticClass: "box-txt", staticStyle: { color: "#f00" } },
                  [_vm._v("Weex项目外链「可能一去无回，慎入」")]
                )
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "box-line line-serve" }, [
                _c(
                  "div",
                  {
                    staticClass: "i-box-l",
                    on: {
                      click: function($event) {
                        return _vm.jumpNative(
                          "http://cdn.zwwill.com/justdo8/jsbundles/index.js"
                        )
                      }
                    }
                  },
                  [
                    _c(
                      "text",
                      {
                        staticClass: "i-box-icon iconfont",
                        staticStyle: { color: "#00ad00" }
                      },
                      [_vm._v("")]
                    ),
                    _c("text", { staticClass: "i-box-tlt" }, [
                      _vm._v("Just Do 8")
                    ])
                  ]
                )
              ])
            ])
          ])
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-294ca5e6", esExports)
  }
}

/***/ }),
/* 219 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_gray" },
    [
      _c(
        "scroller",
        [
          _c("pcenterHeader"),
          _vm._v(" "),
          _c("div", { staticClass: "personal_out" }, [
            _c(
              "div",
              { staticClass: "personal_center" },
              [
                _c(
                  "wxc-cell",
                  {
                    attrs: { desc: "3046951607", "has-top-border": false },
                    on: { wxcCellClicked: _vm.wxcCellClicked }
                  },
                  [
                    _c(
                      "div",
                      {
                        staticClass: "label_out",
                        attrs: { slot: "label" },
                        slot: "label"
                      },
                      [
                        _c("image", {
                          staticClass: "phone_image",
                          attrs: { src: _vm.get_img_path("qq.png") }
                        }),
                        _vm._v(" "),
                        _c("text", { staticClass: "label_out_text" }, [
                          _vm._v("交易所/新币对接")
                        ])
                      ]
                    )
                  ]
                ),
                _vm._v(" "),
                _c(
                  "wxc-cell",
                  {
                    attrs: { desc: "1143758324", "has-top-border": false },
                    on: { wxcCellClicked: _vm.wxcCellClicked }
                  },
                  [
                    _c(
                      "div",
                      {
                        staticClass: "label_out",
                        attrs: { slot: "label" },
                        slot: "label"
                      },
                      [
                        _c("image", {
                          staticClass: "phone_image",
                          attrs: { src: _vm.get_img_path("qq.png") }
                        }),
                        _vm._v(" "),
                        _c("text", { staticClass: "label_out_text" }, [
                          _vm._v("广告合作")
                        ])
                      ]
                    )
                  ]
                ),
                _vm._v(" "),
                _c(
                  "wxc-cell",
                  {
                    attrs: { desc: "2818392801", "has-top-border": false },
                    on: { wxcCellClicked: _vm.wxcCellClicked }
                  },
                  [
                    _c(
                      "div",
                      {
                        staticClass: "label_out",
                        attrs: { slot: "label" },
                        slot: "label"
                      },
                      [
                        _c("image", {
                          staticClass: "phone_image",
                          attrs: { src: _vm.get_img_path("qq.png") }
                        }),
                        _vm._v(" "),
                        _c("text", { staticClass: "label_out_text" }, [
                          _vm._v("商务合作")
                        ])
                      ]
                    )
                  ]
                ),
                _vm._v(" "),
                _c(
                  "wxc-cell",
                  {
                    attrs: { desc: "2026927046", "has-top-border": false },
                    on: { wxcCellClicked: _vm.wxcCellClicked }
                  },
                  [
                    _c(
                      "div",
                      {
                        staticClass: "label_out",
                        attrs: { slot: "label" },
                        slot: "label"
                      },
                      [
                        _c("image", {
                          staticClass: "phone_image",
                          attrs: { src: _vm.get_img_path("qq.png") }
                        }),
                        _vm._v(" "),
                        _c("text", { staticClass: "label_out_text" }, [
                          _vm._v("51BB8客服")
                        ])
                      ]
                    )
                  ]
                ),
                _vm._v(" "),
                _c(
                  "wxc-cell",
                  {
                    attrs: {
                      desc: "service@51bb8.com",
                      "has-top-border": false
                    },
                    on: { wxcCellClicked: _vm.wxcCellClicked }
                  },
                  [
                    _c(
                      "div",
                      {
                        staticClass: "label_out",
                        attrs: { slot: "label" },
                        slot: "label"
                      },
                      [
                        _c("image", {
                          staticClass: "phone_image",
                          attrs: { src: _vm.get_img_path("mailbox.png") }
                        }),
                        _vm._v(" "),
                        _c("text", { staticClass: "label_out_text" }, [
                          _vm._v("联系邮箱")
                        ])
                      ]
                    )
                  ]
                ),
                _vm._v(" "),
                _c(
                  "wxc-cell",
                  {
                    attrs: {
                      desc: "http://www.51bb8.com",
                      "has-top-border": false
                    },
                    on: { wxcCellClicked: _vm.wxcCellClicked }
                  },
                  [
                    _c(
                      "div",
                      {
                        staticClass: "label_out",
                        attrs: { slot: "label" },
                        slot: "label"
                      },
                      [
                        _c("image", {
                          staticClass: "phone_image",
                          attrs: { src: _vm.get_img_path("network.png") }
                        }),
                        _vm._v(" "),
                        _c("text", { staticClass: "label_out_text" }, [
                          _vm._v("官方网址")
                        ])
                      ]
                    )
                  ]
                ),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "personal_info" },
                  [
                    _c(
                      "wxc-cell",
                      {
                        attrs: {
                          title: "关于我们",
                          "has-arrow": true,
                          "has-top-border": false
                        },
                        on: {
                          wxcCellClicked: function($event) {
                            return _vm.goAboutUs()
                          }
                        }
                      },
                      [
                        _c("image", {
                          staticClass: "phone_image",
                          attrs: {
                            slot: "label",
                            src: _vm.get_img_path("about_us.png")
                          },
                          slot: "label"
                        })
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "wxc-cell",
                      {
                        attrs: {
                          title: "免责声明",
                          "has-arrow": true,
                          "has-top-border": false
                        },
                        on: {
                          wxcCellClicked: function($event) {
                            return _vm.goDisclaimer()
                          }
                        }
                      },
                      [
                        _c("image", {
                          staticClass: "phone_image",
                          attrs: {
                            slot: "label",
                            src: _vm.get_img_path("declare.png")
                          },
                          slot: "label"
                        })
                      ]
                    )
                  ],
                  1
                )
              ],
              1
            )
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4df57bad", esExports)
  }
}

/***/ }),
/* 220 */,
/* 221 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_white" },
    [
      _c("loginHeader", { attrs: { data: _vm.data } }),
      _vm._v(" "),
      _c("div", { staticClass: "register_out bg_white" }, [
        _c("div", { staticClass: "input_wrapper" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.username,
                expression: "username"
              }
            ],
            staticClass: "input bg_gray",
            attrs: { type: "text", placeholder: "请输入用户名", value: "" },
            domProps: { value: _vm.username },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.username = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("image", {
            staticClass: "input_img",
            attrs: { src: _vm.get_img_path("icon_head.png") }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "hint_out" }, [
          _c("text", { staticClass: "hint_text" }, [
            _vm._v(
              "提示：用户名（3-12个字符 ，可使用字母、数字、汉字、下划线，不能为纯数字，且首末字符不能为下划线）"
            )
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper" }, [
          _c(
            "div",
            {
              staticClass: "input_register",
              on: {
                click: function($event) {
                  return _vm.modifyInfo()
                }
              }
            },
            [
              _c("text", { staticClass: "input_register_text color1" }, [
                _vm._v("确定")
              ])
            ]
          )
        ])
      ]),
      _vm._v(" "),
      _c("wxc-loading", {
        attrs: {
          show: _vm.isShowLoad,
          type: _vm.type,
          "loading-text": _vm.loadingText,
          interval: _vm.interval
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4fdf6165", esExports)
  }
}

/***/ }),
/* 222 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper" },
    [_c("home-header"), _vm._v(" "), _c("router-view")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-61472db0", esExports)
  }
}

/***/ }),
/* 223 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "wrapper" }, [
    _c("image", {
      staticClass: "close_content",
      attrs: { resize: "cover", src: _vm.get_img_path("wx_close.png") },
      on: {
        click: function($event) {
          return _vm.closeBack()
        }
      }
    }),
    _vm._v(" "),
    _c(
      "div",
      { class: ["webview-box", _vm.isipx ? "web-ipx" : ""] },
      [
        _c("web", {
          ref: "wv",
          staticClass: "webview",
          attrs: { src: _vm.url },
          on: { error: _vm.error }
        })
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6766af5c", esExports)
  }
}

/***/ }),
/* 224 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_white" },
    [
      _c("loginHeader", { attrs: { data: _vm.data } }),
      _vm._v(" "),
      _c("div", { staticClass: "register_out bg_white" }, [
        _c("div", { staticClass: "hint_out_top" }, [
          _c("text", { staticClass: "hint_text" }, [
            _vm._v("提示：未注册用户将使用手机号自动创建账号")
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.mobileNo,
                expression: "mobileNo"
              }
            ],
            staticClass: "input bg_gray",
            attrs: {
              placeholder: "手机号",
              value: "",
              type: "tel",
              maxlength: "11"
            },
            domProps: { value: _vm.mobileNo },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.mobileNo = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("image", {
            staticClass: "input_img",
            attrs: { src: _vm.get_img_path("mobile.png") }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper send_code_out" }, [
          _c("div", { staticClass: "input_code_out" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.vCode,
                  expression: "vCode"
                }
              ],
              staticClass: "input_code bg_gray",
              attrs: {
                autofocus: _vm.vcodeFocus,
                type: "tel",
                maxlength: "6",
                placeholder: "手机验证码",
                value: ""
              },
              domProps: { value: _vm.vCode },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.vCode = $event.target.value
                }
              }
            }),
            _vm._v(" "),
            _c("image", {
              staticClass: "input_img",
              attrs: { src: _vm.get_img_path("correct.png") }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "input_code_btn" }, [
            _c(
              "text",
              {
                staticClass: "send_code",
                class: [
                  _vm.datatime.judgetime ? "send_btn_on" : "send_btn_off"
                ],
                on: {
                  click: function($event) {
                    return _vm.sendCode()
                  }
                }
              },
              [_vm._v(_vm._s(_vm.datatime.timetext))]
            )
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "hint_out",
            on: {
              click: function($event) {
                return _vm.jump("/login")
              }
            }
          },
          [
            _c("text", { staticClass: "hint_pwdlogin color1" }, [
              _vm._v("账号密码登录")
            ])
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper" }, [
          _c(
            "div",
            {
              staticClass: "input_register",
              on: {
                click: function($event) {
                  return _vm.goModifyPwd()
                }
              }
            },
            [
              _c("text", { staticClass: "input_register_text color1" }, [
                _vm._v("登录")
              ])
            ]
          )
        ])
      ]),
      _vm._v(" "),
      _c("wxc-loading", {
        attrs: {
          show: _vm.isShowLoad,
          type: _vm.type,
          "loading-text": _vm.loadingText,
          interval: _vm.interval
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6b0aecc0", esExports)
  }
}

/***/ }),
/* 225 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_gray" },
    [
      _c(
        "scroller",
        { attrs: { "show-scrollbar": "false" } },
        [
          _c("pcenterHeader"),
          _vm._v(" "),
          _c("div", { staticClass: "personal_out" }, [
            _c(
              "div",
              { staticClass: "personal_info" },
              [
                _c("wxc-cell", {
                  attrs: {
                    label: "邮箱",
                    title: _vm.resData.email,
                    "has-top-border": false
                  }
                }),
                _vm._v(" "),
                _c("wxc-cell", {
                  attrs: {
                    label: "用户名",
                    title: _vm.resData.account,
                    "has-arrow": true,
                    "has-top-border": false
                  },
                  on: {
                    wxcCellClicked: function($event) {
                      return _vm.modifyInfo()
                    }
                  }
                }),
                _vm._v(" "),
                _c("wxc-cell", {
                  attrs: {
                    label: "注册时间",
                    title: _vm.resData.registTime,
                    "has-top-border": false
                  }
                }),
                _vm._v(" "),
                _c("wxc-cell", {
                  attrs: {
                    label: "最后登录时间",
                    title: _vm.resData.lastLoginTime,
                    "has-top-border": false
                  }
                }),
                _vm._v(" "),
                _c("wxc-cell", {
                  attrs: {
                    label: "密码",
                    title: _vm.resData.pwd,
                    "has-arrow": true,
                    "has-top-border": false
                  },
                  on: {
                    wxcCellClicked: function($event) {
                      return _vm.modifyPassword()
                    }
                  }
                })
              ],
              1
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c("wxc-loading", {
        attrs: {
          show: _vm.isShowLoad,
          type: _vm.type,
          "loading-text": _vm.loadingText,
          interval: _vm.interval
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6be20be2", esExports)
  }
}

/***/ }),
/* 226 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_white" },
    [
      _c(
        "scroller",
        { attrs: { "show-scrollbar": "false" } },
        [
          _c("loginHeader", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.isshow,
                expression: "isshow"
              }
            ],
            attrs: { data: _vm.data }
          }),
          _vm._v(" "),
          _c("div", { staticClass: "login_out bg_white" }, [
            _c("image", {
              class: [_vm.isIPhoneX ? "bb8_logo" : "default_bb8_logo"],
              attrs: {
                resize: "cover",
                src: _vm.get_img_path("login_biwei.png")
              }
            }),
            _vm._v(" "),
            _c("div", { staticClass: "input_wrapper" }, [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.userNumber,
                    expression: "userNumber"
                  }
                ],
                staticClass: "input bg_gray",
                attrs: {
                  onchange: "onchangeUserNumber",
                  type: "text",
                  placeholder: "请输入用户名/手机号/邮箱",
                  value: ""
                },
                domProps: { value: _vm.userNumber },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.userNumber = $event.target.value
                  }
                }
              }),
              _vm._v(" "),
              _c("image", {
                staticClass: "input_img",
                attrs: { src: _vm.get_img_path("mobile.png") }
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "input_wrapper" }, [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.userPassword,
                    expression: "userPassword"
                  }
                ],
                staticClass: "input bg_gray",
                attrs: {
                  onchange: "onchangeUserPassword",
                  type: "password",
                  placeholder: "请输入密码",
                  value: ""
                },
                domProps: { value: _vm.userPassword },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.userPassword = $event.target.value
                  }
                }
              }),
              _vm._v(" "),
              _c("image", {
                staticClass: "input_img",
                attrs: { src: _vm.get_img_path("password.png") }
              })
            ]),
            _vm._v(" "),
            _c(
              "div",
              {
                class: [
                  _vm.isAndroid ? "android_input_wrapper" : "input_wrapper"
                ]
              },
              [
                _c(
                  "div",
                  {
                    class: [
                      _vm.isAndroid
                        ? "android_register_out"
                        : "input_fastlogin_out"
                    ]
                  },
                  [
                    _c("div", { staticClass: "register_out" }, [
                      _c(
                        "text",
                        {
                          staticClass: "input_register color1",
                          on: {
                            click: function($event) {
                              return _vm.jump("/fastLogin")
                            }
                          }
                        },
                        [_vm._v("快速登录")]
                      )
                    ])
                  ]
                ),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    class: [
                      _vm.isAndroid
                        ? "android_register_out"
                        : "input_register_out"
                    ]
                  },
                  [
                    _c("div", { staticClass: "register_out" }, [
                      _c(
                        "text",
                        {
                          staticClass: "input_register color1",
                          on: {
                            click: function($event) {
                              return _vm.jump("/register")
                            }
                          }
                        },
                        [_vm._v("注册 /")]
                      ),
                      _vm._v(" "),
                      _c(
                        "text",
                        {
                          staticClass: "input_register color1",
                          on: {
                            click: function($event) {
                              return _vm.findPassword()
                            }
                          }
                        },
                        [_vm._v(" 忘记密码?")]
                      )
                    ])
                  ]
                )
              ]
            ),
            _vm._v(" "),
            _c("div", { staticClass: "input_wrapper" }, [
              _c(
                "div",
                {
                  staticClass: "input_login",
                  on: {
                    click: function($event) {
                      return _vm.login()
                    }
                  }
                },
                [
                  _c("text", { staticClass: "input_login_text color1" }, [
                    _vm._v("登录")
                  ])
                ]
              )
            ]),
            _vm._v(" "),
            _c(
              "div",
              {
                class: [_vm.isIPhoneX ? "login_footer" : "login_footer_default"]
              },
              [
                _c("div", { staticClass: "login_bb8_out" }, [
                  _c("image", {
                    staticClass: "login_bb8",
                    attrs: {
                      resize: "cover",
                      src: _vm.get_img_path("login_bb8.png")
                    }
                  })
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    staticClass: "footer_out",
                    on: {
                      click: function($event) {
                        return _vm.openProtocol()
                      }
                    }
                  },
                  [
                    _c("text", { staticClass: "color2 small_text" }, [
                      _vm._v("登录即同意")
                    ]),
                    _vm._v(" "),
                    _c("text", { staticClass: "color1 small_text" }, [
                      _vm._v("《隐私权政策》")
                    ])
                  ]
                )
              ]
            )
          ]),
          _vm._v(" "),
          _c("wxc-loading", {
            attrs: {
              show: _vm.isShowLoad,
              type: _vm.type,
              "loading-text": _vm.loadingText,
              interval: _vm.interval
            }
          })
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-79d5601c", esExports)
  }
}

/***/ }),
/* 227 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_gray" },
    [
      _c(
        "scroller",
        { attrs: { "show-scrollbar": "false" } },
        [
          _c("pcenterHeader"),
          _vm._v(" "),
          _c("div", { staticClass: "personal_out" }, [
            _vm.isLogin
              ? _c("div", { staticClass: "personal_header bg_white" }, [
                  _c("image", {
                    staticClass: "user_logo",
                    attrs: {
                      resize: "cover",
                      src: _vm.get_img_path("icon_user_img.png")
                    }
                  }),
                  _vm._v(" "),
                  _c("text", { staticClass: "color1 user_name" }, [
                    _vm._v(_vm._s(_vm.resData.phone))
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "exit_btn_out",
                      on: {
                        click: function($event) {
                          return _vm.valedateExit()
                        }
                      }
                    },
                    [
                      _c("text", { staticClass: "exit_btn color1" }, [
                        _vm._v("退出登录")
                      ])
                    ]
                  )
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.isLogin
              ? _c("div", { staticClass: "my_module_out" }, [
                  _c("div", { staticClass: "line_gary" }),
                  _vm._v(" "),
                  _c("div", { staticClass: "my_module_content" }, [
                    _c(
                      "div",
                      {
                        staticClass: "module_item",
                        on: {
                          click: function($event) {
                            return _vm.openController(
                              "MyOptionalViewController"
                            )
                          }
                        }
                      },
                      [
                        _c("image", {
                          staticClass: "module_image",
                          attrs: { src: _vm.get_img_path("wx_optional.png") }
                        }),
                        _vm._v(" "),
                        _c("text", { staticClass: "exit_btn color1" }, [
                          _vm._v("自选")
                        ])
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass: "module_item",
                        on: {
                          click: function($event) {
                            return _vm.openController(
                              "MySubscribeViewController"
                            )
                          }
                        }
                      },
                      [
                        _c("image", {
                          staticClass: "module_image",
                          attrs: { src: _vm.get_img_path("wx_attention.png") }
                        }),
                        _vm._v(" "),
                        _c("text", { staticClass: "exit_btn color1" }, [
                          _vm._v("关注")
                        ])
                      ]
                    ),
                    _vm._v(" "),
                    _c("div", { staticClass: "module_item" }, [
                      _c("image", {
                        staticClass: "module_image",
                        attrs: { src: _vm.get_img_path("wx_asset.png") }
                      }),
                      _vm._v(" "),
                      _c("text", { staticClass: "exit_btn color1" }, [
                        _vm._v("资产")
                      ])
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "module_item" }, [
                      _c("image", {
                        staticClass: "module_image",
                        attrs: { src: _vm.get_img_path("wx_mailbox.png") }
                      }),
                      _vm._v(" "),
                      _c("text", { staticClass: "exit_btn color1" }, [
                        _vm._v("信箱")
                      ])
                    ])
                  ])
                ])
              : _vm._e(),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "personal_center" },
              [
                !_vm.isLogin
                  ? _c(
                      "wxc-cell",
                      {
                        attrs: {
                          "has-arrow": true,
                          "has-top-border": false,
                          "cell-style": _vm.loginStyle
                        },
                        on: {
                          wxcCellClicked: function($event) {
                            return _vm.goLogin()
                          }
                        }
                      },
                      [
                        _c(
                          "text",
                          {
                            staticClass: "login_text",
                            attrs: { slot: "title" },
                            slot: "title"
                          },
                          [_vm._v("登录")]
                        ),
                        _vm._v(" "),
                        _c("image", {
                          staticClass: "default_image",
                          attrs: {
                            slot: "label",
                            src: _vm.get_img_path("user_logo.png")
                          },
                          slot: "label"
                        })
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.isLogin
                  ? _c(
                      "wxc-cell",
                      {
                        attrs: {
                          title: "我的信息",
                          "has-arrow": true,
                          "cell-style": _vm.cellStyle,
                          "has-top-border": false
                        },
                        on: { wxcCellClicked: _vm.goUserInfo }
                      },
                      [
                        _c("image", {
                          staticClass: "phone_image",
                          attrs: {
                            slot: "label",
                            src: _vm.get_img_path("pinfo.png")
                          },
                          slot: "label"
                        })
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "contact_us" },
                  [
                    _c("wxc-cell", { attrs: { "has-top-border": false } }, [
                      _c(
                        "div",
                        {
                          staticClass: "label_out",
                          attrs: { slot: "label" },
                          slot: "label"
                        },
                        [
                          _c("image", {
                            staticClass: "phone_image",
                            attrs: { src: _vm.get_img_path("qq.png") }
                          }),
                          _vm._v(" "),
                          _c("text", { staticClass: "label_out_text" }, [
                            _vm._v("交易所/新币对接")
                          ]),
                          _vm._v(" "),
                          _c("text", { staticClass: "desc_text" }, [
                            _vm._v("3046951607")
                          ])
                        ]
                      )
                    ]),
                    _vm._v(" "),
                    _c("wxc-cell", { attrs: { "has-top-border": false } }, [
                      _c(
                        "div",
                        {
                          staticClass: "label_out",
                          attrs: { slot: "label" },
                          slot: "label"
                        },
                        [
                          _c("image", {
                            staticClass: "phone_image",
                            attrs: { src: _vm.get_img_path("qq.png") }
                          }),
                          _vm._v(" "),
                          _c("text", { staticClass: "label_out_text" }, [
                            _vm._v("广告合作")
                          ]),
                          _vm._v(" "),
                          _c("text", { staticClass: "desc_text" }, [
                            _vm._v("1143758324")
                          ])
                        ]
                      )
                    ]),
                    _vm._v(" "),
                    _c("wxc-cell", { attrs: { "has-top-border": false } }, [
                      _c(
                        "div",
                        {
                          staticClass: "label_out",
                          attrs: { slot: "label" },
                          slot: "label"
                        },
                        [
                          _c("image", {
                            staticClass: "phone_image",
                            attrs: { src: _vm.get_img_path("qq.png") }
                          }),
                          _vm._v(" "),
                          _c("text", { staticClass: "label_out_text" }, [
                            _vm._v("商务合作")
                          ]),
                          _vm._v(" "),
                          _c("text", { staticClass: "desc_text" }, [
                            _vm._v("2818392801")
                          ])
                        ]
                      )
                    ]),
                    _vm._v(" "),
                    _c("wxc-cell", { attrs: { "has-top-border": false } }, [
                      _c(
                        "div",
                        {
                          staticClass: "label_out",
                          attrs: { slot: "label" },
                          slot: "label"
                        },
                        [
                          _c("image", {
                            staticClass: "phone_image",
                            attrs: { src: _vm.get_img_path("qq.png") }
                          }),
                          _vm._v(" "),
                          _c("text", { staticClass: "label_out_text" }, [
                            _vm._v("51BB8客服")
                          ]),
                          _vm._v(" "),
                          _c("text", { staticClass: "desc_text" }, [
                            _vm._v("2026927046")
                          ])
                        ]
                      )
                    ]),
                    _vm._v(" "),
                    _c(
                      "wxc-cell",
                      {
                        attrs: { "has-top-border": false },
                        on: {
                          wxcCellClicked: function($event) {
                            return _vm.openWebView("mailto:service@51bb8.com")
                          }
                        }
                      },
                      [
                        _c(
                          "div",
                          {
                            staticClass: "label_out",
                            attrs: { slot: "label" },
                            slot: "label"
                          },
                          [
                            _c("image", {
                              staticClass: "phone_image",
                              attrs: { src: _vm.get_img_path("mailbox.png") }
                            }),
                            _vm._v(" "),
                            _c("text", { staticClass: "label_out_text" }, [
                              _vm._v("联系邮箱")
                            ]),
                            _vm._v(" "),
                            _c("text", { staticClass: "desc_text" }, [
                              _vm._v("service@51bb8.com")
                            ])
                          ]
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "wxc-cell",
                      {
                        attrs: { "has-top-border": false },
                        on: {
                          wxcCellClicked: function($event) {
                            return _vm.openWebView("http://www.51bb8.com")
                          }
                        }
                      },
                      [
                        _c(
                          "div",
                          {
                            staticClass: "label_out",
                            attrs: { slot: "label" },
                            slot: "label"
                          },
                          [
                            _c("image", {
                              staticClass: "phone_image",
                              attrs: { src: _vm.get_img_path("network.png") }
                            }),
                            _vm._v(" "),
                            _c("text", { staticClass: "label_out_text" }, [
                              _vm._v("官方网址")
                            ]),
                            _vm._v(" "),
                            _c("text", { staticClass: "desc_text" }, [
                              _vm._v("http://www.51bb8.com")
                            ])
                          ]
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        class: [
                          _vm.isAndroid
                            ? "android_personal_info"
                            : "personal_info"
                        ]
                      },
                      [
                        _c(
                          "wxc-cell",
                          {
                            attrs: {
                              "has-arrow": true,
                              "cell-style": _vm.cellStyle,
                              "has-top-border": false
                            },
                            on: {
                              wxcCellClicked: function($event) {
                                return _vm.goAboutUs()
                              }
                            }
                          },
                          [
                            _c(
                              "div",
                              {
                                staticClass: "label_out_more",
                                attrs: { slot: "label" },
                                slot: "label"
                              },
                              [
                                _c("image", {
                                  staticClass: "phone_image",
                                  attrs: {
                                    src: _vm.get_img_path("about_us.png")
                                  }
                                }),
                                _vm._v(" "),
                                _c("text", { staticClass: "label_out_text" }, [
                                  _vm._v("关于我们")
                                ])
                              ]
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _c(
                          "wxc-cell",
                          {
                            attrs: {
                              "has-arrow": true,
                              "cell-style": _vm.cellStyle,
                              "has-top-border": false
                            },
                            on: {
                              wxcCellClicked: function($event) {
                                return _vm.goDisclaimer()
                              }
                            }
                          },
                          [
                            _c(
                              "div",
                              {
                                staticClass: "label_out_more",
                                attrs: { slot: "label" },
                                slot: "label"
                              },
                              [
                                _c("image", {
                                  staticClass: "phone_image",
                                  attrs: {
                                    src: _vm.get_img_path("declare.png")
                                  }
                                }),
                                _vm._v(" "),
                                _c("text", { staticClass: "label_out_text" }, [
                                  _vm._v("免责声明")
                                ])
                              ]
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _c(
                          "wxc-cell",
                          {
                            attrs: {
                              "has-arrow": true,
                              "cell-style": _vm.cellStyle,
                              "has-top-border": false
                            },
                            on: { wxcCellClicked: _vm.goSettingPage }
                          },
                          [
                            _c(
                              "div",
                              {
                                staticClass: "label_out_more",
                                attrs: { slot: "label" },
                                slot: "label"
                              },
                              [
                                _c("image", {
                                  staticClass: "phone_image",
                                  attrs: { src: _vm.get_img_path("setup.png") }
                                }),
                                _vm._v(" "),
                                _c("text", { staticClass: "label_out_text" }, [
                                  _vm._v("设置")
                                ])
                              ]
                            )
                          ]
                        )
                      ],
                      1
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _c("wxc-popover", {
                  ref: "wxc-popover2",
                  attrs: {
                    buttons: _vm.btns2,
                    position: _vm.popoverPosition2,
                    arrowPosition: _vm.popoverArrowPosition2,
                    textStyle: _vm.popoverStyle
                  },
                  on: { wxcPopoverButtonClicked: _vm.popoverButtonClicked }
                })
              ],
              1
            )
          ]),
          _vm._v(" "),
          _c("div", { class: [_vm.isAndroid ? "" : "footer_null"] })
        ],
        1
      ),
      _vm._v(" "),
      _c("wxc-loading", {
        attrs: {
          show: _vm.isShowLoad,
          type: _vm.type,
          "loading-text": _vm.loadingText,
          interval: _vm.interval
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7f9f167e", esExports)
  }
}

/***/ }),
/* 228 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_white" },
    [
      _c(
        "scroller",
        [
          _c("pcenterHeader"),
          _vm._v(" "),
          _c("div", { staticClass: "main_out" }, [
            _c("div", { staticClass: "main_centent" }, [
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.titleone))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.titletwo))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textone))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.texttwo))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textthree))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textfour))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textfive))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textsix))
              ]),
              _vm._v(" "),
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textseven))
              ])
            ])
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7fe16f48", esExports)
  }
}

/***/ }),
/* 229 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_white" },
    [
      _c("loginHeader", { attrs: { data: _vm.data } }),
      _vm._v(" "),
      _c("div", { staticClass: "register_out bg_white" }, [
        _c("div", { staticClass: "input_wrapper" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.userName,
                expression: "userName"
              }
            ],
            staticClass: "input bg_gray",
            attrs: { type: "text", placeholder: "请输入用户名", value: "" },
            domProps: { value: _vm.userName },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.userName = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("image", {
            staticClass: "input_img",
            attrs: { src: _vm.get_img_path("icon_head.png") }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.mobileNo,
                expression: "mobileNo"
              }
            ],
            staticClass: "input bg_gray",
            attrs: {
              type: "nubmer",
              placeholder: "请输入手机号/邮箱",
              value: ""
            },
            domProps: { value: _vm.mobileNo },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.mobileNo = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("image", {
            staticClass: "input_img",
            attrs: { src: _vm.get_img_path("mobile.png") }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.userPwd,
                expression: "userPwd"
              }
            ],
            staticClass: "input bg_gray",
            attrs: { type: "password", placeholder: "请输入密码", value: "" },
            domProps: { value: _vm.userPwd },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.userPwd = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("image", {
            staticClass: "input_img",
            attrs: { src: _vm.get_img_path("password.png") }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.nextUserPwd,
                expression: "nextUserPwd"
              }
            ],
            staticClass: "input bg_gray",
            attrs: {
              type: "password",
              placeholder: "请重新输入密码",
              value: ""
            },
            domProps: { value: _vm.nextUserPwd },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.nextUserPwd = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("image", {
            staticClass: "input_img",
            attrs: { src: _vm.get_img_path("password.png") }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper send_code_out" }, [
          _c("div", { staticClass: "input_code_out" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.vCode,
                  expression: "vCode"
                }
              ],
              staticClass: "input_code bg_gray",
              attrs: { type: "nubmer", placeholder: "请输入验证码", value: "" },
              domProps: { value: _vm.vCode },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.vCode = $event.target.value
                }
              }
            }),
            _vm._v(" "),
            _c("image", {
              staticClass: "input_img",
              attrs: { src: _vm.get_img_path("correct.png") }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "input_code_btn" }, [
            _c(
              "text",
              {
                staticClass: "send_code",
                class: [
                  _vm.datatime.judgetime ? "send_btn_on" : "send_btn_off"
                ],
                on: {
                  click: function($event) {
                    return _vm.sendCode()
                  }
                }
              },
              [_vm._v(_vm._s(_vm.datatime.timetext))]
            )
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "input_wrapper" }, [
          _c(
            "div",
            {
              staticClass: "input_register",
              on: {
                click: function($event) {
                  return _vm.register()
                }
              }
            },
            [
              _c("text", { staticClass: "input_register_text color1" }, [
                _vm._v("注册")
              ])
            ]
          )
        ])
      ]),
      _vm._v(" "),
      _c("wxc-loading", {
        attrs: {
          show: _vm.isShowLoad,
          type: _vm.type,
          "loading-text": _vm.loadingText,
          interval: _vm.interval
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-b7e71980", esExports)
  }
}

/***/ }),
/* 230 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper bg_white" },
    [
      _c(
        "scroller",
        [
          _c(
            "wxc-minibar",
            {
              attrs: {
                "background-color": _vm.getMainColor(),
                "text-color": "#FFFFFF"
              },
              on: { wxcMinibarLeftButtonClicked: _vm.minibarLeftButtonClick }
            },
            [
              _c("div", { attrs: { slot: "left" }, slot: "left" }, [
                _c("image", {
                  staticStyle: { height: "50px", width: "50px" },
                  attrs: { src: _vm.get_img_path("back.png") }
                })
              ]),
              _vm._v(" "),
              _c(
                "text",
                {
                  staticStyle: { "font-size": "37px", color: "white" },
                  attrs: { slot: "middle" },
                  slot: "middle"
                },
                [_vm._v("我的团队")]
              ),
              _vm._v(" "),
              _c("div", { attrs: { slot: "right" }, slot: "right" })
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "about_out" }, [
            _c("image", {
              staticClass: "null_logo",
              attrs: { resize: "cover", src: _vm.get_img_path("null_logo.png") }
            }),
            _vm._v(" "),
            _c("div", { staticClass: "main_centent" }, [
              _c("text", { staticClass: "text_one" }, [
                _vm._v(_vm._s(_vm.textone))
              ])
            ])
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-c92751cc", esExports)
  }
}

/***/ }),
/* 231 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { class: ["wrapper", _vm.isIpx && _vm.isIpx() ? "w-ipx" : ""] },
    [
      _c(
        "div",
        {
          staticClass: "bar-item",
          on: {
            click: function($event) {
              return _vm.tabTo("home")
            }
          }
        },
        [
          _c(
            "text",
            { staticClass: "bar-ic iconfont", class: [this.isActive("home")] },
            [_vm._v("")]
          ),
          _vm._v(" "),
          _c(
            "text",
            { staticClass: "bar-txt", class: [this.isActive("home")] },
            [_vm._v("币行情")]
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "bar-item",
          on: {
            click: function($event) {
              return _vm.tabTo("topic")
            }
          }
        },
        [
          _c(
            "text",
            {
              staticClass: "bar-ic iconfont",
              class: [this.pIndexKey == "topic" ? "bar-active" : ""]
            },
            [_vm._v("")]
          ),
          _vm._v(" "),
          _c(
            "text",
            {
              staticClass: "bar-txt",
              class: [this.pIndexKey == "topic" ? "bar-active" : ""]
            },
            [_vm._v("全球行情")]
          ),
          _vm._v(" "),
          _c("text", { staticClass: "notice-dot" })
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "bar-item",
          on: {
            click: function($event) {
              return _vm.tabTo("bnews")
            }
          }
        },
        [
          _c(
            "text",
            { staticClass: "bar-ic iconfont", class: [this.isActive("bnews")] },
            [_vm._v("")]
          ),
          _vm._v(" "),
          _c(
            "text",
            { staticClass: "bar-txt", class: [this.isActive("bnews")] },
            [_vm._v("早知道")]
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "bar-item",
          on: {
            click: function($event) {
              return _vm.tabTo("my")
            }
          }
        },
        [
          _c(
            "text",
            { staticClass: "bar-ic iconfont", class: [this.isActive("my")] },
            [_vm._v("")]
          ),
          _vm._v(" "),
          _c("text", { staticClass: "bar-txt", class: [this.isActive("my")] }, [
            _vm._v("个人")
          ]),
          _vm._v(" "),
          _c("text", { staticClass: "i-notice" }, [_vm._v("2")])
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-f57a2d20", esExports)
  }
}

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(181);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5b1f5ab3", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-000bae73\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-000bae73\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(182);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("c87758bc", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-000bae73\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./loginDisclaimer.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-000bae73\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./loginDisclaimer.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(183);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("2a127b4b", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-10c1e354\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-10c1e354\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(184);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a5979b84", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-10c1e354\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./modifyPwd.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-10c1e354\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./modifyPwd.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(185);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("16f20fbe", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1a7e9f9e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1a7e9f9e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(186);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("e6e5759c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-214f1168\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-214f1168\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(187);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a4ca43c2", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-214f1168\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./modifySendCode.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-214f1168\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./modifySendCode.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(188);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("c7b3b302", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-285305fc\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-285305fc\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(189);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("b5f0445c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-285305fc\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./main.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-285305fc\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./main.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(190);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("7a124e3a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-294ca5e6\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./UserView.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-294ca5e6\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./UserView.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(191);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a8ec4d50", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4df57bad\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4df57bad\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(192);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("6d84abf2", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4df57bad\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./contactUs.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4df57bad\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./contactUs.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 244 */,
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(194);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("b06d9612", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4fdf6165\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4fdf6165\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(195);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("d32b47d4", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4fdf6165\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./modifyInfo.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4fdf6165\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./modifyInfo.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(196);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("886f75e2", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6766af5c\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./webview.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6766af5c\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./webview.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(197);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("7035663d", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6b0aecc0\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6b0aecc0\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(198);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("d0702d20", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6b0aecc0\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./fastLogin.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6b0aecc0\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./fastLogin.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(199);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("7ca1c72d", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6be20be2\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6be20be2\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(200);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("50784288", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6be20be2\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./personalInfo.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6be20be2\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./personalInfo.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(201);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a6904cf4", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-79d5601c\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-79d5601c\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(202);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("671b72f9", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-79d5601c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./login.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-79d5601c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(203);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1fcf16b6", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7f9f167e\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7f9f167e\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(204);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1afcabe9", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7f9f167e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./personal.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7f9f167e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./personal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(205);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1d2abb96", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7fe16f48\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7fe16f48\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(206);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("de5f5f82", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7fe16f48\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./disclaimer.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7fe16f48\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./disclaimer.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(207);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("d69ed544", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-b7e71980\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-b7e71980\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(208);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1157941a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-b7e71980\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./register.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-b7e71980\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./register.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(209);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("9e2a8264", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c92751cc\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c92751cc\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(210);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("4fe5e7dd", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c92751cc\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./aboutUs.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c92751cc\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./aboutUs.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(211);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("69eadb06", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f57a2d20\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./tabBar.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f57a2d20\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./tabBar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

var _tabBar = __webpack_require__(162);

var _tabBar2 = _interopRequireDefault(_tabBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// var modal = weex.requireModule('modal');
exports.default = {
    data: function data() {
        return {};
    },

    components: {
        'tab-bar': _tabBar2.default
    },
    created: function created() {
        _util2.default.initIconFont();
    },

    methods: {
        onTabTo: function onTabTo(_result) {
            var _key = _result.data.key || '';
            this.$router && this.$router.push('/' + _key);
        }
    }
};

/***/ }),
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * 存储localStorage
 */
var setStore = exports.setStore = function setStore(name, content) {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
var getStore = exports.getStore = function getStore(name) {
    if (!name) return;
    return window.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
var removeStore = exports.removeStore = function removeStore(name) {
    if (!name) return;
    window.localStorage.removeItem(name);
};

/**
 * 获取style样式
 */
var getStyle = exports.getStyle = function getStyle(element, attr) {
    var NumberMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'int';

    var target = void 0;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') {
        target = element.scrollTop;
    } else if (element.currentStyle) {
        target = element.currentStyle[attr];
    } else {
        target = document.defaultView.getComputedStyle(element, null)[attr];
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return NumberMode == 'float' ? parseFloat(target) : parseInt(target);
};

/**
 * 页面到达底部，加载更多
 */
var loadMore = exports.loadMore = function loadMore(element, callback) {
    var windowHeight = window.screen.height;
    var height = void 0;
    var setTop = void 0;
    var paddingBottom = void 0;
    var marginBottom = void 0;
    var requestFram = void 0;
    var oldScrollTop = void 0;

    document.body.addEventListener('scroll', function () {
        loadMore();
    }, false);
    //运动开始时获取元素 高度 和 offseTop, pading, margin
    element.addEventListener('touchstart', function () {
        height = element.offsetHeight;
        setTop = element.offsetTop;
        paddingBottom = getStyle(element, 'paddingBottom');
        marginBottom = getStyle(element, 'marginBottom');
    }, { passive: true });

    //运动过程中保持监听 scrollTop 的值判断是否到达底部
    element.addEventListener('touchmove', function () {
        loadMore();
    }, { passive: true });

    //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
    element.addEventListener('touchend', function () {
        oldScrollTop = document.body.scrollTop;
        moveEnd();
    }, { passive: true });

    var moveEnd = function moveEnd() {
        requestFram = requestAnimationFrame(function () {
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                loadMore();
                moveEnd();
            } else {
                cancelAnimationFrame(requestFram);
                //为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
                height = element.offsetHeight;
                loadMore();
            }
        });
    };

    var loadMore = function loadMore() {
        if (document.body.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
            callback();
        }
    };
};

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
var showBack = exports.showBack = function showBack(callback) {
    var requestFram = void 0;
    var oldScrollTop = void 0;

    document.addEventListener('scroll', function () {
        showBackFun();
    }, false);
    document.addEventListener('touchstart', function () {
        showBackFun();
    }, { passive: true });

    document.addEventListener('touchmove', function () {
        showBackFun();
    }, { passive: true });

    document.addEventListener('touchend', function () {
        oldScrollTop = document.body.scrollTop;
        moveEnd();
    }, { passive: true });

    var moveEnd = function moveEnd() {
        requestFram = requestAnimationFrame(function () {
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                moveEnd();
            } else {
                cancelAnimationFrame(requestFram);
            }
            showBackFun();
        });
    };

    //判断是否达到目标点
    var showBackFun = function showBackFun() {
        if (document.body.scrollTop > 500) {
            callback(true);
        } else {
            callback(false);
        }
    };
};

/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
var animate = exports.animate = function animate(element, target) {
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 400;
    var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'ease-out';
    var callback = arguments[4];

    clearInterval(element.timer);

    //判断不同参数的情况
    if (duration instanceof Function) {
        callback = duration;
        duration = 400;
    } else if (duration instanceof String) {
        mode = duration;
        duration = 400;
    }

    //判断不同参数的情况
    if (mode instanceof Function) {
        callback = mode;
        mode = 'ease-out';
    }

    //获取dom样式
    var attrStyle = function attrStyle(attr) {
        if (attr === "opacity") {
            return Math.round(getStyle(element, attr, 'float') * 100);
        } else {
            return getStyle(element, attr);
        }
    };
    //根字体大小，需要从此将 rem 改成 px 进行运算
    var rootSize = parseFloat(document.documentElement.style.fontSize);

    var unit = {};
    var initState = {};

    //获取目标属性单位和初始样式值
    Object.keys(target).forEach(function (attr) {
        if (/[^\d^\.]+/gi.test(target[attr])) {
            unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
        } else {
            unit[attr] = 'px';
        }
        initState[attr] = attrStyle(attr);
    });

    //去掉传入的后缀单位
    Object.keys(target).forEach(function (attr) {
        if (unit[attr] == 'rem') {
            target[attr] = Math.ceil(parseInt(target[attr]) * rootSize);
        } else {
            target[attr] = parseInt(target[attr]);
        }
    });

    var flag = true; //假设所有运动到达终点
    var remberSpeed = {}; //记录上一个速度值,在ease-in模式下需要用到
    element.timer = setInterval(function () {
        Object.keys(target).forEach(function (attr) {
            var iSpeed = 0; //步长
            var status = false; //是否仍需运动
            var iCurrent = attrStyle(attr) || 0; //当前元素属性址
            var speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
            var intervalTime = void 0; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
            switch (mode) {
                case 'ease-out':
                    speedBase = iCurrent;
                    intervalTime = duration * 5 / 400;
                    break;
                case 'linear':
                    speedBase = initState[attr];
                    intervalTime = duration * 20 / 400;
                    break;
                case 'ease-in':
                    var oldspeed = remberSpeed[attr] || 0;
                    iSpeed = oldspeed + (target[attr] - initState[attr]) / duration;
                    remberSpeed[attr] = iSpeed;
                    break;
                default:
                    speedBase = iCurrent;
                    intervalTime = duration * 5 / 400;
            }
            if (mode !== 'ease-in') {
                iSpeed = (target[attr] - speedBase) / intervalTime;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            }
            //判断是否达步长之内的误差距离，如果到达说明到达目标点
            switch (mode) {
                case 'ease-out':
                    status = iCurrent != target[attr];
                    break;
                case 'linear':
                    status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                    break;
                case 'ease-in':
                    status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                    break;
                default:
                    status = iCurrent != target[attr];
            }

            if (status) {
                flag = false;
                //opacity 和 scrollTop 需要特殊处理
                if (attr === "opacity") {
                    element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
                    element.style.opacity = (iCurrent + iSpeed) / 100;
                } else if (attr === 'scrollTop') {
                    element.scrollTop = iCurrent + iSpeed;
                } else {
                    element.style[attr] = iCurrent + iSpeed + 'px';
                }
            } else {
                flag = true;
            }

            if (flag) {
                clearInterval(element.timer);
                if (callback) {
                    callback();
                }
            }
        });
    }, 20);
};

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var GET_USERINFO = exports.GET_USERINFO = 'GET_USERINFO';
var RECORD_USERINFO = exports.RECORD_USERINFO = 'RECORD_USERINFO';
var RETSET_NAME = exports.RETSET_NAME = 'RETSET_NAME';

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(323);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(328);


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(32);
var TAG = __webpack_require__(7)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 273 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(13);
var isObject = __webpack_require__(11);
var newPromiseCapability = __webpack_require__(180);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(13);
var aFunction = __webpack_require__(50);
var SPECIES = __webpack_require__(7)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(48);
var invoke = __webpack_require__(335);
var html = __webpack_require__(51);
var cel = __webpack_require__(35);
var global = __webpack_require__(2);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(32)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.host = host;
exports.https = https;
exports.timeAgo = timeAgo;
exports.unescape = unescape;
function host(url) {
  if (!url) return '';
  var host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  var parts = host.split('.').slice(-3);
  if (parts[0] === 'www') parts.shift();
  return parts.join('.');
}

function https(url) {
  var env = weex.config.env || WXEnvironment;
  if (env.platform === 'iOS' && typeof url === 'string') {
    return url.replace(/^http\:/, 'https:');
  }
  return url;
}

function timeAgo(time) {
  var between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
}

function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

function unescape(text) {
  var res = text || '';[['<p>', '\n'], ['&amp;', '&'], ['&amp;', '&'], ['&apos;', '\''], ['&#x27;', '\''], ['&#x2F;', '/'], ['&#39;', '\''], ['&#47;', '/'], ['&lt;', '<'], ['&gt;', '>'], ['&nbsp;', ' '], ['&quot;', '"']].forEach(function (pair) {
    res = res.replace(new RegExp(pair[0], 'ig'), pair[1]);
  });

  return res;
}

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = __webpack_require__(34);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stream = weex.requireModule('stream');
var navigator = weex.requireModule('navigator');

exports.default = {
    data: function data() {
        return {
            rpx: 1,
            apiDomain: '',
            android: weex.config.env.platform.toLowerCase() == 'android',
            ios: weex.config.env.platform.toLowerCase() == 'ios',
            web: weex.config.env.platform.toLowerCase() == 'web'
        };
    },
    created: function created() {
        var self = this;
        var env = weex.config.env;
        var rWidth = env.deviceWidth;
        env.deviceWidth > 828 && (rWidth = env.deviceWidth / 3 * 2);
        self.rpx = 750 / rWidth;
        //self.apiDomain='http://xiazhou.me/example/xiazhou-weex';
        if (!self.web) {
            self.apiDomain = 'http://192.168.31.241:8080'; //替换成你电脑的IP，并保证手机能访问到电脑(连同一个wifi就好啦)
        }
    },

    methods: {
        jumpBack: function jumpBack() {
            if (this.$router) {
                this.$router.back(-1);
            }
        },
        jump: function jump(to) {
            console.log("jump>>" + to);
            if (this.$router) {
                this.$router.push(to);
            }
        },
        jumpWeb: function jumpWeb(_url) {
            var url = _util2.default.setBundleUrl(weex.config.bundleUrl, 'page/webview.js?weburl=' + _url);

            console.log("jumpweb>>" + url);
            navigator.push({
                url: url,
                animated: "true"
            });
        },

        //children router 
        jumpUrl: function jumpUrl(_url, params) {
            var bundleUrl = weex.config.bundleUrl;
            var url = bundleUrl.substring(0, bundleUrl.lastIndexOf('?'));

            console.log("jumpUrl>>" + url);
            if (params) {
                url = url + "?" + params;
            }
            url += "#" + _url;
            // const modal = weex.requireModule('modal');
            // modal.toast({ message: url, duration: 10 })
            navigator.push({
                url: url,
                animated: "true"
            }, function (event) {
                // modal.toast({ message: 'callback: ' + event })
            });
        },
        getParamsByJson: function getParamsByJson(json) {
            var str = "";
            for (var val in json) {
                str += "&" + val + "=" + json[val];
            }
            return str.substring(1);
        },
        getParams: function getParams() {
            var str = weex.config.bundleUrl;
            str = str.substring(str.lastIndexOf('?') + 1, str.lastIndexOf('#'));
            var temp = {};
            if (!str) {
                return temp;
            }
            if (str.indexOf('=') < 0) {
                temp[str] = "";
                return temp;
            }
            var arr = str.split('&');
            arr.forEach(function (item) {
                var w = item.match(/([^=]*)=(.*)/);
                temp[w[1]] = w[2];
            });
            return temp;
        },
        getParameterByName: function getParameterByName(name, url) {
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        isIpx: function isIpx() {
            return weex && (weex.config.env.deviceModel === 'iPhone10,3' || weex.config.env.deviceModel === 'iPhone10,6');
        },
        get_img_path: function get_img_path(img_name) {
            var self = this;
            var img_path = '';

            if (self.web) {
                img_path = '/assets/images/' + img_name;
            } else if (self.android) {
                // img_name = img_name.substr(0, img_name.lastIndexOf('.'));
                // img_path = `local:///${img_name}`
                // modal.toast({ message: img_name, duration: 10 })

                img_path = 'images/' + img_name;
                // img_path = `/assets/images/${img_name}`
            } else {
                //img_path = `../images/${img_name}`
                img_path = 'assets://' + img_name;
            }

            return img_path;
        },
        GET: function GET(api, callback) {
            stream.sendHttp({
                method: 'GET',
                url: url
            }, function (ret) {
                var retdata = JSON.parse(ret);
                callback(retdata);
            });
        },
        POST: function POST(url, data, callback) {
            stream.fetch({
                method: 'POST',
                url: url,
                type: 'json',
                body: data,
                headers: { 'Content-Type': 'application/json' }
            }, function (ret) {
                console.log(ret);
                if (!ret.ok) {
                    modal.toast({ message: '网络有问题，连不上', duration: 1 });
                    // modal.toast({ message: 'callback: ' + event })
                    console.log("request failed");
                    // callback("0");
                } else {
                    if (ret.data.response.ok) {
                        callback(ret.data);
                    } else {
                        modal.toast({ message: ret.data.response.message, duration: 1 });
                        console.log(ret.data);
                        // callback("0");
                    }
                }
            });
        },


        getiPhonexFringeHeight: function getiPhonexFringeHeight(deviceHeight) {
            return 88 * deviceHeight / 1624;
        },

        formatDatePattern: function formatDatePattern(date, fmt) {
            if (!date) {
                return;
            }

            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            var o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    var str = o[k] + '';
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
                }
            }
            return fmt;
        },

        formatDate: function formatDate(time) {
            var date = new Date(time);
            return this.formatDatePattern(date, "yyyy-MM-dd hh:mm");
        },

        timeAgo: function timeAgo(time) {
            var between = (Date.now() - Number(time)) / 1000;
            if (between < 2 * 60) {
                return '刚刚';
            } else if (between < 3600) {
                return this.pluralize(~~(between / 60), ' 分钟');
            } else if (between < 86400) {
                return this.pluralize(~~(between / 3600), ' 小时');
            } else if (between < 30 * 86400) {
                return this.pluralize(~~(between / 86400), ' 天');
            } else {
                return this.pluralize(~~(between / 86400), ' 天');
            }
        },

        pluralize: function pluralize(time, label) {
            if (time === 1) {
                return time + label;
            }
            return time + label + '前';
        },

        gethref: function gethref(url) {
            if (!url) {
                return url;
            }
            if (url.indexOf("http") == 0) {
                return url;
            } else {
                return 'http://www.xxxx.com/' + url;
            }
        },
        getMainColor: function getMainColor() {
            return "#0056d3";
        },
        getToolbarTextStyle: function getToolbarTextStyle() {
            return "font-size: 38px;color: white";
        },
        getToolbarImgStyle: function getToolbarImgStyle() {
            return "height: 50px;width: 50px";
        }
    }
};

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vueRouter = __webpack_require__(363);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _home = __webpack_require__(163);

var _home2 = _interopRequireDefault(_home);

var _UserView = __webpack_require__(177);

var _UserView2 = _interopRequireDefault(_UserView);

var _login = __webpack_require__(166);

var _login2 = _interopRequireDefault(_login);

var _register = __webpack_require__(170);

var _register2 = _interopRequireDefault(_register);

var _personal = __webpack_require__(175);

var _personal2 = _interopRequireDefault(_personal);

var _personalInfo = __webpack_require__(176);

var _personalInfo2 = _interopRequireDefault(_personalInfo);

var _modifySendCode = __webpack_require__(169);

var _modifySendCode2 = _interopRequireDefault(_modifySendCode);

var _modifyPwd = __webpack_require__(168);

var _modifyPwd2 = _interopRequireDefault(_modifyPwd);

var _aboutUs = __webpack_require__(171);

var _aboutUs2 = _interopRequireDefault(_aboutUs);

var _contactUs = __webpack_require__(172);

var _contactUs2 = _interopRequireDefault(_contactUs);

var _disclaimer = __webpack_require__(173);

var _disclaimer2 = _interopRequireDefault(_disclaimer);

var _loginDisclaimer = __webpack_require__(174);

var _loginDisclaimer2 = _interopRequireDefault(_loginDisclaimer);

var _modifyInfo = __webpack_require__(167);

var _modifyInfo2 = _interopRequireDefault(_modifyInfo);

var _fastLogin = __webpack_require__(165);

var _fastLogin2 = _interopRequireDefault(_fastLogin);

var _webview = __webpack_require__(178);

var _webview2 = _interopRequireDefault(_webview);

var _main = __webpack_require__(164);

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Vue.use(_vueRouter2.default);

exports.default = new _vueRouter2.default({
    // mode: 'abstract',
    routes: [{ path: '/', redirect: '/main' }, { path: '/main', name: "main", component: _main2.default }, {
        path: '/home',
        component: _home2.default,
        children: []
    }, { path: '/my', component: _UserView2.default }, { path: '/login', component: _login2.default }, { path: '/register', component: _register2.default }, { path: '/pcenter', component: _personal2.default }, { path: '/modifySendCode', component: _modifySendCode2.default }, { path: '/modifyPwd', component: _modifyPwd2.default }, { path: '/aboutUs', component: _aboutUs2.default }, { path: '/contactUs', component: _contactUs2.default }, { path: '/disclaimer', component: _disclaimer2.default }, { path: '/loginDisclaimer', component: _loginDisclaimer2.default }, { path: '/modifyInfo', component: _modifyInfo2.default }, { path: '/personalInfo', component: _personalInfo2.default }, { path: '/fastLogin', component: _fastLogin2.default }, { path: '/webview', component: _webview2.default }]
});

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vuex = __webpack_require__(371);

var _vuex2 = _interopRequireDefault(_vuex);

var _actions = __webpack_require__(318);

var _actions2 = _interopRequireDefault(_actions);

var _mutations = __webpack_require__(320);

var _mutations2 = _interopRequireDefault(_mutations);

var _getters = __webpack_require__(319);

var _getters2 = _interopRequireDefault(_getters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Vuex is auto installed on the web
// import Vue from 'vue'
if (WXEnvironment.platform !== 'Web') {
    Vue.use(_vuex2.default);
}

var state = {
    userInfo: {}, //用户信息
    geohash: '31.22299,121.36025' //地址geohash值

    // state?: S;
    // getters?: GetterTree<S, S>;
    // actions?: ActionTree<S, S>;
    // mutations?: MutationTree<S>;
    // modules?: ModuleTree<S>;
    // plugins?: Plugin<S>[];
    // strict?: boolean;
};exports.default = new _vuex2.default.Store({
    state: state,
    getters: _getters2.default,
    actions: _actions2.default,
    mutations: _mutations2.default
});

/***/ }),
/* 281 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ba5bd90_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(361);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(367)
  __webpack_require__(369)
  __webpack_require__(368)
}
var normalizeComponent = __webpack_require__(6)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7ba5bd90"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ba5bd90_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/App.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7ba5bd90", Component.options)
  } else {
    hotAPI.reload("data-v-7ba5bd90", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */
/***/ (function(module, exports) {

exports.sync = function (store, router, options) {
  var moduleName = (options || {}).moduleName || 'route'

  store.registerModule(moduleName, {
    namespaced: true,
    state: cloneRoute(router.currentRoute),
    mutations: {
      'ROUTE_CHANGED': function ROUTE_CHANGED (state, transition) {
        store.state[moduleName] = cloneRoute(transition.to, transition.from)
      }
    }
  })

  var isTimeTraveling = false
  var currentPath

  // sync router on store change
  var storeUnwatch = store.watch(
    function (state) { return state[moduleName]; },
    function (route) {
      var fullPath = route.fullPath;
      if (fullPath === currentPath) {
        return
      }
      if (currentPath != null) {
        isTimeTraveling = true
        router.push(route)
      }
      currentPath = fullPath
    },
    { sync: true }
  )

  // sync store on router navigation
  var afterEachUnHook = router.afterEach(function (to, from) {
    if (isTimeTraveling) {
      isTimeTraveling = false
      return
    }
    currentPath = to.fullPath
    store.commit(moduleName + '/ROUTE_CHANGED', { to: to, from: from })
  })

  return function unsync () {
    // On unsync, remove router hook
    if (afterEachUnHook != null) {
      afterEachUnHook()
    }

    // On unsync, remove store watch
    if (storeUnwatch != null) {
      storeUnwatch()
    }

    // On unsync, unregister Module with store
    store.unregisterModule(moduleName)
  }
}

function cloneRoute (to, from) {
  var clone = {
    name: to.name,
    path: to.path,
    hash: to.hash,
    query: to.query,
    params: to.params,
    fullPath: to.fullPath,
    meta: to.meta
  }
  if (from) {
    clone.from = cloneRoute(from)
  }
  return Object.freeze(clone)
}



/***/ }),
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

var baseUrl = '';
var routerMode = 'hash';
var imgBaseUrl = void 0;

if ("production".NODE_ENV == 'development') {
    exports.imgBaseUrl = imgBaseUrl = '';
} else if ("production".NODE_ENV == 'production') {
    exports.baseUrl = baseUrl = '';
    exports.imgBaseUrl = imgBaseUrl = '';
}

exports.baseUrl = baseUrl;
exports.routerMode = routerMode;
exports.imgBaseUrl = imgBaseUrl;

/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__(271);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = __webpack_require__(30);

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = __webpack_require__(270);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _env = __webpack_require__(313);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'fetch';
    var dataStr, requestConfig, response, responseJson;
    return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    // let fetch = async(url = '', data = {}, type = 'GET', method = 'fetch') => {
                    type = type.toUpperCase();
                    url = _env.baseUrl + url;

                    if (type == 'GET') {
                        dataStr = ''; //数据拼接字符串

                        Object.keys(data).forEach(function (key) {
                            dataStr += key + '=' + data[key] + '&';
                        });

                        if (dataStr !== '') {
                            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
                            url = url + '?' + dataStr;
                        }
                    }

                    if (!(window.fetch && method == 'fetch')) {
                        _context.next = 21;
                        break;
                    }

                    requestConfig = {
                        credentials: 'include',
                        method: type,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        mode: "cors",
                        cache: "force-cache"
                    };


                    if (type == 'POST') {
                        Object.defineProperty(requestConfig, 'body', {
                            value: JSON.stringify(data)
                        });
                    }

                    _context.prev = 6;
                    _context.next = 9;
                    return fetch(url, requestConfig);

                case 9:
                    response = _context.sent;
                    _context.next = 12;
                    return response.json();

                case 12:
                    responseJson = _context.sent;
                    return _context.abrupt('return', responseJson);

                case 16:
                    _context.prev = 16;
                    _context.t0 = _context['catch'](6);
                    throw new Error(_context.t0);

                case 19:
                    _context.next = 22;
                    break;

                case 21:
                    return _context.abrupt('return', new Promise(function (resolve, reject) {
                        var requestObj = void 0;
                        if (window.XMLHttpRequest) {
                            requestObj = new XMLHttpRequest();
                        } else {
                            requestObj = new ActiveXObject();
                        }

                        var sendData = '';
                        if (type == 'POST') {
                            sendData = JSON.stringify(data);
                        }

                        requestObj.open(type, url, true);
                        requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        requestObj.send(sendData);

                        requestObj.onreadystatechange = function () {
                            if (requestObj.readyState == 4) {
                                if (requestObj.status == 200) {
                                    var obj = requestObj.response;
                                    if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object') {
                                        obj = JSON.parse(obj);
                                    }
                                    resolve(obj);
                                } else {
                                    reject(requestObj);
                                }
                            }
                        };
                    }));

                case 22:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, undefined, [[6, 16]]);
}));

/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _App = __webpack_require__(281);

var _App2 = _interopRequireDefault(_App);

var _router = __webpack_require__(279);

var _router2 = _interopRequireDefault(_router);

var _store = __webpack_require__(280);

var _store2 = _interopRequireDefault(_store);

var _vuexRouterSync = __webpack_require__(286);

var _filters = __webpack_require__(277);

var filters = _interopRequireWildcard(_filters);

var _mixins = __webpack_require__(278);

var _mixins2 = _interopRequireDefault(_mixins);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import FastClick from 'fastclick'


// import 'font-awesome/css/font-awesome.css';
//import 'animate.css/animate.css'; // get animate.css
// import 'bulma/css/bulma.css'

// import 'bulma'

// import jquery from 'jquery'

// import VueSocketio from 'vue-socket.io';
// import socketio from 'socket.io-client';
// Vue.use(VueSocketio, socketio('http://socketserver.com:1923'), store);

// import * as dd from './assets/js/kline';
// Vue.use(dd);
// import VueECharts from 'vue-echarts/components/ECharts.vue'
// Vue.component('chart', VueECharts)

//300s
// if ('addEventListener' in document) {
//     document.addEventListener('DOMContentLoaded', function() {
//         FastClick.attach(document.body)
//     }, false)
// }

// sync the router with the vuex store.
// this registers `store.state.route`
// import weexVueRouter from 'weex-vue-router'
// Vue.use(weexVueRouter, { router, weex })


/**
 * Created by zwwill on 2017/8/28.
 */
(0, _vuexRouterSync.sync)(_store2.default, _router2.default);

// register global utility filters.
Object.keys(filters).forEach(function (key) {
    Vue.filter(key, filters[key]);
});

// register global mixins.
Vue.mixin(_mixins2.default);

Vue.config.productionTip = false;

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
new Vue(Vue.util.extend({ el: '#root', router: _router2.default }, _App2.default));

var path = '/';

//app根据路由跳转
var bundleUrl = weex.config.bundleUrl;
if (bundleUrl) {
    var idx = bundleUrl.indexOf("#");
    if (idx > 0) {
        var burl = bundleUrl.slice(idx + 1);

        if (burl.indexOf("#") > 0) {

            burl = burl.slice(0, burl.indexOf("#"));
        }

        path = burl;
    }
}
console.info(11111111);
console.info(weex.config.bundleUrl);
console.info(path);
console.info(11111111);
_router2.default.push(path);

/***/ }),
/* 316 */,
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUser = undefined;

var _fetch = __webpack_require__(314);

var _fetch2 = _interopRequireDefault(_fetch);

var _mUtils = __webpack_require__(268);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 获取用户信息
 */

var getUser = exports.getUser = function getUser() {
  return (0, _fetch2.default)('/v1/user', { user_id: (0, _mUtils.getStore)('user_id') });
};

/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__(271);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(270);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getData = __webpack_require__(317);

var _mutationTypes = __webpack_require__(269);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    getUserInfo: function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref) {
            var commit = _ref.commit,
                state = _ref.state;
            var res;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _getData.getUser)();

                        case 2:
                            res = _context.sent;

                            commit(_mutationTypes.GET_USERINFO, res);

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getUserInfo(_x) {
            return _ref2.apply(this, arguments);
        }

        return getUserInfo;
    }()
};

/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = __webpack_require__(44);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _RECORD_USERINFO$RETS;

var _mutationTypes = __webpack_require__(269);

var _mUtils = __webpack_require__(268);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (_RECORD_USERINFO$RETS = {}, (0, _defineProperty3.default)(_RECORD_USERINFO$RETS, _mutationTypes.RECORD_USERINFO, function (state, info) {
    state.userInfo = info;
    state.login = true;
    (0, _mUtils.setStore)('user_id', info.user_id);
}), (0, _defineProperty3.default)(_RECORD_USERINFO$RETS, _mutationTypes.RETSET_NAME, function (state, username) {
    state.userInfo = Object.assign({}, state.userInfo, { username: username });
}), _RECORD_USERINFO$RETS);

/***/ }),
/* 321 */,
/* 322 */,
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(332), __esModule: true };

/***/ }),
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(329);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 329 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),
/* 330 */,
/* 331 */,
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(54);
__webpack_require__(55);
__webpack_require__(56);
__webpack_require__(347);
__webpack_require__(348);
__webpack_require__(349);
module.exports = __webpack_require__(9).Promise;


/***/ }),
/* 333 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(48);
var call = __webpack_require__(337);
var isArrayIter = __webpack_require__(336);
var anObject = __webpack_require__(13);
var toLength = __webpack_require__(53);
var getIterFn = __webpack_require__(344);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 335 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(20);
var ITERATOR = __webpack_require__(7)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(13);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(7)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var macrotask = __webpack_require__(276).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(32)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(8);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 341 */,
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var core = __webpack_require__(9);
var dP = __webpack_require__(5);
var DESCRIPTORS = __webpack_require__(3);
var SPECIES = __webpack_require__(7)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(272);
var ITERATOR = __webpack_require__(7)('iterator');
var Iterators = __webpack_require__(20);
module.exports = __webpack_require__(9).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 345 */,
/* 346 */,
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(14);
var global = __webpack_require__(2);
var ctx = __webpack_require__(48);
var classof = __webpack_require__(272);
var $export = __webpack_require__(17);
var isObject = __webpack_require__(11);
var aFunction = __webpack_require__(50);
var anInstance = __webpack_require__(333);
var forOf = __webpack_require__(334);
var speciesConstructor = __webpack_require__(275);
var task = __webpack_require__(276).set;
var microtask = __webpack_require__(339)();
var newPromiseCapabilityModule = __webpack_require__(180);
var perform = __webpack_require__(273);
var userAgent = __webpack_require__(343);
var promiseResolve = __webpack_require__(274);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(7)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(340)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(21)($Promise, PROMISE);
__webpack_require__(342)(PROMISE);
Wrapper = __webpack_require__(9)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(338)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(17);
var core = __webpack_require__(9);
var global = __webpack_require__(2);
var speciesConstructor = __webpack_require__(275);
var promiseResolve = __webpack_require__(274);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(17);
var newPromiseCapability = __webpack_require__(180);
var perform = __webpack_require__(273);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\nbody{\n    margin: 0;\n    padding: 0;\n    background-color: white;\n    color:#333;\n}\n\n", ""]);

// exports


/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.s10 {\r\n    font-size: 10px;\n}\n.s11 {\r\n    font-size: 11px;\n}\n.s12 {\r\n    font-size: 12px;\n}\n.s14 {\r\n    font-size: 14px;\n}\n.s16 {\r\n    font-size: 16px;\n}\n.s18 {\r\n    font-size: 18px;\n}\n.s20 {\r\n    font-size: 20px;\n}\n.s22 {\r\n    font-size: 22px;\n}\n.s24 {\r\n    font-size: 24px;\n}\n.color {\r\n    color: #ffe45f;\n}\n.color1 {\r\n    color: #292b32;\n}\n.color2 {\r\n    color: #7f7f7f;\n}\n.colorBg{\r\n    color: #0056d3;\n}\n.bg {\r\n    background-color: #ffe45f\n}\n.bg1 {\r\n    background-color: #ff6149\n}\n.bg2 {\r\n    background-color: #ff920a\n}\n.bg_gray {\r\n    background-color: #F3F3F5\n}\n.bg_white {\r\n    background-color: white\n}\n.send_btn_on {\r\n    background-color: #ffe45f;\r\n    color: #292b32;\n}\n.send_btn_on:active {\r\n    background-color: #FFED93;\n}\n.send_btn_off {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n}\n.send_btn_off :active {\r\n    background-color: #EBECEE;\r\n    color: #7f7f7f;\n} ", ""]);

// exports


/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.app-wrapper[data-v-7ba5bd90]{\n    background-color: #f4f4f4;\n}\n.r-box[data-v-7ba5bd90]{\n    position: absolute;\n    top:0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n}\n", ""]);

// exports


/***/ }),
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "app-wrapper" },
    [_c("router-view", { staticClass: "r-box" })],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7ba5bd90", esExports)
  }
}

/***/ }),
/* 362 */,
/* 363 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
  * vue-router v2.8.1
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if ("production".NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if ("production".NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

function extend (to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    "production".NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if ("production".NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if ("production".NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if ("production".NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if ("production".NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if ("production".NODE_ENV !== 'production') {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if ("production".NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if ("production".NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if ("production".NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if ("production".NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if ("production".NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  window.history.replaceState({ key: getStateKey() }, '');
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if ("production".NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if ("production".NODE_ENV !== 'production') {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          "production".NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if ("production".NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  "production".NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '2.8.1';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["default"] = (VueRouter);


/***/ }),
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(353);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5be4cc20", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ba5bd90\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ba5bd90\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 368 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(354);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5dd2a58d", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ba5bd90\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ba5bd90\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 369 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(355);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("0d216d72", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ba5bd90\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./App.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ba5bd90\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./App.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 370 */,
/* 371 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v2.5.0
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if ("production".NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if ("production".NODE_ENV !== 'production') {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if ("production".NODE_ENV !== 'production') {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if ("production".NODE_ENV !== 'production') {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if ("production".NODE_ENV !== 'production') {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if ("production".NODE_ENV !== 'production') {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    "production".NODE_ENV !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if ("production".NODE_ENV !== 'production') {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if ("production".NODE_ENV !== 'production') {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if ("production".NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if ("production".NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ("production".NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ("production".NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if ("production".NODE_ENV !== 'production') {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if ("production".NODE_ENV !== 'production') {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if ("production".NODE_ENV !== 'production') {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if ("production".NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ("production".NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ("production".NODE_ENV !== 'production' && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '2.5.0',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ })
/******/ ]);