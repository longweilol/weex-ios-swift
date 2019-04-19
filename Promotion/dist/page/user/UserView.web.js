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
/******/ 	return __webpack_require__(__webpack_require__.s = 311);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
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

/***/ 1:
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

/***/ 127:
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

/***/ 135:
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

/***/ 153:
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

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.iconfont[data-v-c1186616] {\n    font-family:iconfont;\n}\n.wrapper[data-v-c1186616]{\n    position: fixed;\n    top: 0;\n    left: 0;right: 0;\n    height: 114px;\n    padding-top: 44px;\n    display:flex;\n    flex-wrap: nowrap;\n    flex-direction: row;\n    justify-content: space-around;\n    z-index: 101;\n    background-color: #fafafa;\n    opacity: .99;\n}\n.w-ipx[data-v-c1186616]{\n    height: 154px;\n    padding-top: 84px;\n}\n.scan[data-v-c1186616],.notice[data-v-c1186616]{\n    height: 80px;\n    width: 96px\n}\n.ic[data-v-c1186616],.txt[data-v-c1186616],.search[data-v-c1186616]{\n    text-align: center;\n    color:#666;\n    font-weight: 300;\n}\n.ic[data-v-c1186616]{\n    font-size: 32px;\n}\n.txt[data-v-c1186616]{\n    font-size: 18px;\n}\n.search[data-v-c1186616] {\n    flex: 1;\n    height: 60px;\n    font-size: 26px;\n    padding-top: 13px;\n    background-color: #ededed;\n    border-radius: 8px;\n}\n", ""]);

// exports


/***/ }),

/***/ 158:
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

/***/ 160:
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

/***/ 177:
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

/***/ 190:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.user-info[data-v-294ca5e6] {\n  padding-top: 60px;\n  padding-left: 80px;\n  padding-right: 60px;\n}\n.user-name[data-v-294ca5e6] {\n  font-size: 72px;\n  font-weight: bold;\n  margin-bottom: 60px;\n}\n.loading-text[data-v-294ca5e6] {\n  font-family: Verdana, Geneva, sans-serif;\n  font-size: 44px;\n  color: #BBBBBB;\n}\n.meta-label[data-v-294ca5e6] {\n  font-family: Verdana, Geneva, sans-serif;\n  font-size: 32px;\n  margin-bottom: 15px;\n  color: #333333;\n}\n.user-about[data-v-294ca5e6] {\n  margin-top: 20px;\n  font-size: 28px;\n  color: #666666;\n}\n.iconfont[data-v-294ca5e6] {\n      font-family:iconfont;\n}\n.wrapper[data-v-294ca5e6]{\n      background-color: #f4f4f4;\n}\n.fbs[data-v-294ca5e6]{\n      background-color: #f4f4f4;\n      padding-bottom: 1000px;\n      margin-bottom: -1000px;\n}\n.scroller[data-v-294ca5e6]{\n      margin-bottom: 90px;\n}\n.ml-ipx[data-v-294ca5e6]{\n      margin-bottom: 140px;\n}\n.cell-button[data-v-294ca5e6]{\n      margin-bottom: 18px;\n}\n.header[data-v-294ca5e6]{\n      height: 380px;\n}\n.h-ipx[data-v-294ca5e6]{\n      height: 420px;\n}\n.header-bg[data-v-294ca5e6]{\n      position: absolute;\n      top:0;\n      left: 0;\n      right: 0;\n      height: 500px;\n      width: 750px;\n}\n.bg2[data-v-294ca5e6]{\n      top:500px;\n}\n.bg3[data-v-294ca5e6]{\n      top:1000px;\n}\n.i-photo[data-v-294ca5e6]{\n      position: absolute;\n      bottom:60px;\n      left: 30px;\n      height: 130px;\n      width: 130px;\n      border-radius: 130px;\n}\n.i-name[data-v-294ca5e6]{\n      position: absolute;\n      bottom:120px;\n      left: 190px;\n      height: 50px;\n      width: 300px;\n      font-size: 38px;\n      color:#fff;\n}\n.b-tlt[data-v-294ca5e6]{\n      position: absolute;\n      bottom: 70px;\n      left: 190px;\n      height: 40px;\n      width: 350px;\n      display: flex;\n      flex-direction: row;\n      flex-wrap: nowrap;\n}\n.i-tag[data-v-294ca5e6]{\n      width: 30px;\n      height: 30px;\n      font-size: 24px;\n      padding-top: 2px;\n      margin-right: 6px;\n      border-radius: 4px;\n}\n.tag-e[data-v-294ca5e6]{\n      width: 32px;\n      height: 32px;\n}\n.tag-v8[data-v-294ca5e6]{\n      color:#fff;\n      background-color: #b29e75;\n      text-align: center;\n}\n.txt-tag[data-v-294ca5e6]{\n      color:#b4a078;\n      flex: 1;\n      height: 40px;\n      font-size: 28px;\n      overflow: hidden;\n      lines:1;\n      text-overflow: ellipsis;\n}\n.b-qrcode[data-v-294ca5e6]{\n      position: absolute;\n      bottom:80px;\n      right: 40px;\n      height: 80px;\n      width: 80px;\n      border-radius: 70px;\n      text-align: center;\n      font-size: 40px;\n      padding-top: 18px;\n      color:#fff;\n      background-color: rgba(255,255,255,.3);\n}\n.s-box[data-v-294ca5e6]{\n      padding-left: 26px;\n      background-color: #fff;\n}\n.box-tlt[data-v-294ca5e6]{\n      height: 94px;\n}\n.box-txt[data-v-294ca5e6]{\n      font-size: 26px;\n      padding-top: 34px;\n      color:#333;\n}\n.i-box-in[data-v-294ca5e6]{\n      position: absolute;\n      top:34px;\n      right: 30px;\n      color:#333;\n}\n.box-line[data-v-294ca5e6]{\n      height: 132px;\n      display: flex;\n      padding-right: 30px;\n      flex-wrap: nowrap;\n      flex-direction: row;\n      justify-content: space-between;\n}\n.i-box-l[data-v-294ca5e6]{\n      width: 130px;\n      height: 132px;\n}\n.i-box-icon[data-v-294ca5e6]{\n      font-size: 50px;\n      text-align: center;\n      padding-top: 15px;\n      height:79px;\n      padding-bottom: 10px;\n      color:#666;\n}\n.i-box-tlt[data-v-294ca5e6]{\n      font-size: 26px;\n      text-align: center;\n      color:#666;\n}\n.line-serve[data-v-294ca5e6]{\n      padding-top: 20px;\n      height: 150px;\n}\n.border-bottom[data-v-294ca5e6]{\n      border-bottom-width: 1px;\n      border-bottom-color: rgba(0,0,0,.15) ;\n}\n.i-c-orange[data-v-294ca5e6]{\n      color:#ff744d;\n}\n.i-c-yellow[data-v-294ca5e6]{\n      color:#f6a121;\n}\n.i-c-blue[data-v-294ca5e6]{\n      color:#689de5;\n}\n", ""]);

// exports


/***/ }),

/***/ 218:
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

/***/ 241:
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

/***/ 311:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var App = __webpack_require__(177);
App.el = '#root';
new Vue(App);

/***/ }),

/***/ 33:
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

/***/ 6:
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


/***/ })

/******/ });