"use strict";
(self["webpackChunkcobra_extension"] = self["webpackChunkcobra_extension"] || []).push([["src_components_CodeSuggestion_CodeSuggestionRoot_tsx-src_components_CodeSuggestion_index_ts"],{

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/CodeSuggestion/CodeSuggestionWidget.css":
/*!******************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/CodeSuggestion/CodeSuggestionWidget.css ***!
  \******************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.code-suggestion-widget {
  position: absolute;
  z-index: 10000;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  border: 1px solid rgba(0, 0, 0, 0.1);
  animation: slide-up 0.2s ease-out;
  user-select: none;
}

.widget-content {
  display: flex;
  padding: 16px;
  align-items: flex-start;
  gap: 12px;
}

.widget-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f4f0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8B5CF6;
  flex-shrink: 0;
}

.widget-icon i {
  font-size: 14px;
}

.widget-suggestion {
  font-size: 14px;
  color: #333;
  flex: 1;
  line-height: 1.5;
}

.widget-actions {
  display: flex;
  padding: 12px 16px;
  gap: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #fcfcfd;
}

.action-button {
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s ease;
  border: none;
  outline: none;
}

.action-button.apply {
  background-color: #8B5CF6;
  color: white;
  border: 1px solid #8B5CF6;
}

.action-button.apply:hover {
  background-color: #7c4dff;
}

.action-button.dismiss {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.action-button.dismiss:hover {
  background-color: #f5f5f5;
  color: #333;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tooltip arrow */
.code-suggestion-widget::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 20px;
  width: 16px;
  height: 16px;
  background-color: white;
  transform: rotate(45deg);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
} `, "",{"version":3,"sources":["webpack://./src/components/CodeSuggestion/CodeSuggestionWidget.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,cAAc;EACd,YAAY;EACZ,uBAAuB;EACvB,kBAAkB;EAClB,sEAAsE;EACtE,gBAAgB;EAChB,yGAAyG;EACzG,oCAAoC;EACpC,iCAAiC;EACjC,iBAAiB;AACnB;;AAEA;EACE,aAAa;EACb,aAAa;EACb,uBAAuB;EACvB,SAAS;AACX;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,yBAAyB;EACzB,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,cAAc;EACd,cAAc;AAChB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,eAAe;EACf,WAAW;EACX,OAAO;EACP,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,kBAAkB;EAClB,QAAQ;EACR,yCAAyC;EACzC,yBAAyB;AAC3B;;AAEA;EACE,iBAAiB;EACjB,eAAe;EACf,kBAAkB;EAClB,eAAe;EACf,gBAAgB;EAChB,0BAA0B;EAC1B,YAAY;EACZ,aAAa;AACf;;AAEA;EACE,yBAAyB;EACzB,YAAY;EACZ,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,6BAA6B;EAC7B,WAAW;EACX,sBAAsB;AACxB;;AAEA;EACE,yBAAyB;EACzB,WAAW;AACb;;AAEA;EACE;IACE,UAAU;IACV,2BAA2B;EAC7B;EACA;IACE,UAAU;IACV,wBAAwB;EAC1B;AACF;;AAEA,kBAAkB;AAClB;EACE,WAAW;EACX,kBAAkB;EAClB,SAAS;EACT,UAAU;EACV,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,wBAAwB;EACxB,wCAAwC;EACxC,yCAAyC;AAC3C","sourcesContent":[".code-suggestion-widget {\n  position: absolute;\n  z-index: 10000;\n  width: 300px;\n  background-color: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1);\n  overflow: hidden;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  animation: slide-up 0.2s ease-out;\n  user-select: none;\n}\n\n.widget-content {\n  display: flex;\n  padding: 16px;\n  align-items: flex-start;\n  gap: 12px;\n}\n\n.widget-icon {\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  background-color: #f4f0ff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #8B5CF6;\n  flex-shrink: 0;\n}\n\n.widget-icon i {\n  font-size: 14px;\n}\n\n.widget-suggestion {\n  font-size: 14px;\n  color: #333;\n  flex: 1;\n  line-height: 1.5;\n}\n\n.widget-actions {\n  display: flex;\n  padding: 12px 16px;\n  gap: 8px;\n  border-top: 1px solid rgba(0, 0, 0, 0.05);\n  background-color: #fcfcfd;\n}\n\n.action-button {\n  padding: 8px 12px;\n  font-size: 13px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: 500;\n  transition: all 0.15s ease;\n  border: none;\n  outline: none;\n}\n\n.action-button.apply {\n  background-color: #8B5CF6;\n  color: white;\n  border: 1px solid #8B5CF6;\n}\n\n.action-button.apply:hover {\n  background-color: #7c4dff;\n}\n\n.action-button.dismiss {\n  background-color: transparent;\n  color: #666;\n  border: 1px solid #ddd;\n}\n\n.action-button.dismiss:hover {\n  background-color: #f5f5f5;\n  color: #333;\n}\n\n@keyframes slide-up {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n/* Tooltip arrow */\n.code-suggestion-widget::before {\n  content: '';\n  position: absolute;\n  top: -8px;\n  left: 20px;\n  width: 16px;\n  height: 16px;\n  background-color: white;\n  transform: rotate(45deg);\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  border-left: 1px solid rgba(0, 0, 0, 0.1);\n} "],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/components/CodeSuggestion/CodeSuggestionRoot.tsx":
/*!**************************************************************!*\
  !*** ./src/components/CodeSuggestion/CodeSuggestionRoot.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index */ "./src/components/CodeSuggestion/index.ts");




var CodeSuggestionRoot = function () {
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null), container = _a[0], setContainer = _a[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        // Create container for the suggestion UI
        var rootContainer = document.createElement('div');
        rootContainer.id = 'cobra-code-suggestion-root';
        rootContainer.style.position = 'absolute';
        rootContainer.style.top = '0';
        rootContainer.style.left = '0';
        rootContainer.style.width = '0';
        rootContainer.style.height = '0';
        rootContainer.style.overflow = 'visible';
        rootContainer.style.pointerEvents = 'none';
        rootContainer.style.zIndex = '10000';
        // Add container to the document
        document.body.appendChild(rootContainer);
        setContainer(rootContainer);
        // Clean up on unmount
        return function () {
            document.body.removeChild(rootContainer);
        };
    }, []);
    // Return null if the container doesn't exist yet
    if (!container)
        return null;
    // Use a portal to render the SelectionDetector into the container
    return react_dom__WEBPACK_IMPORTED_MODULE_2__.createPortal((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_index__WEBPACK_IMPORTED_MODULE_3__.SelectionDetector, {}), container);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CodeSuggestionRoot);


/***/ }),

/***/ "./src/components/CodeSuggestion/CodeSuggestionWidget.css":
/*!****************************************************************!*\
  !*** ./src/components/CodeSuggestion/CodeSuggestionWidget.css ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_CodeSuggestionWidget_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./CodeSuggestionWidget.css */ "./node_modules/css-loader/dist/cjs.js!./src/components/CodeSuggestion/CodeSuggestionWidget.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_CodeSuggestionWidget_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_CodeSuggestionWidget_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_CodeSuggestionWidget_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_CodeSuggestionWidget_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/CodeSuggestion/CodeSuggestionWidget.tsx":
/*!****************************************************************!*\
  !*** ./src/components/CodeSuggestion/CodeSuggestionWidget.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! framer-motion */ "./node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs");
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! framer-motion */ "./node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs");
/* harmony import */ var _CodeSuggestionWidget_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CodeSuggestionWidget.css */ "./src/components/CodeSuggestion/CodeSuggestionWidget.css");




var defaultSuggestions = [
    "Consider simplifying this expression",
    "Check for off-by-one error",
    "Unused variable detected",
    "This could cause a null pointer exception",
    "Consider using a more efficient algorithm",
    "This loop could be optimized",
    "Potential memory leak here",
    "Consider adding a condition to handle edge cases",
];
var CodeSuggestionWidget = function (_a) {
    var selectedText = _a.selectedText, onDismiss = _a.onDismiss, position = _a.position, isVisible = _a.isVisible, suggestion = _a.suggestion;
    var widgetRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""), displayedSuggestion = _b[0], setDisplayedSuggestion = _b[1];
    // Get a suggestion based on the selected text
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (selectedText && isVisible) {
            if (suggestion) {
                // Use provided suggestion if available
                setDisplayedSuggestion(suggestion);
            }
            else {
                // Fallback to random suggestion
                var randomIndex = Math.floor(Math.random() * defaultSuggestions.length);
                setDisplayedSuggestion(defaultSuggestions[randomIndex]);
            }
        }
    }, [selectedText, isVisible, suggestion]);
    // Handle click outside to dismiss
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (widgetRef.current && !widgetRef.current.contains(event.target)) {
                onDismiss();
            }
        };
        // Handle escape key to dismiss
        var handleKeyDown = function (event) {
            if (event.key === 'Escape') {
                onDismiss();
            }
        };
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible, onDismiss]);
    if (!isVisible || !selectedText)
        return null;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.AnimatePresence, { children: isVisible && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_4__.motion.div, { ref: widgetRef, className: "code-suggestion-widget", style: {
                top: position.top,
                left: position.left,
            }, initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "widget-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "widget-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", { className: "fas fa-lightbulb" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "widget-suggestion", children: displayedSuggestion })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "widget-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-button apply", children: "Apply suggestion" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-button dismiss", onClick: onDismiss, children: "Dismiss" })] })] })) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CodeSuggestionWidget);


/***/ }),

/***/ "./src/components/CodeSuggestion/SelectionDetector.tsx":
/*!*************************************************************!*\
  !*** ./src/components/CodeSuggestion/SelectionDetector.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CodeSuggestionWidget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CodeSuggestionWidget */ "./src/components/CodeSuggestion/CodeSuggestionWidget.tsx");
/* harmony import */ var _services_codeAnalysis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/codeAnalysis */ "./src/services/codeAnalysis.ts");




// Using an enum to define the selectable elements
var SelectableElement;
(function (SelectableElement) {
    SelectableElement["CodeEditor"] = "div.monaco-editor";
    SelectableElement["LeetcodeCodeArea"] = "div.CodeMirror";
    SelectableElement["AnyPre"] = "pre";
})(SelectableElement || (SelectableElement = {}));
var SelectionDetector = function () {
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(''), selectedText = _a[0], setSelectedText = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({ top: 0, left: 0 }), widgetPosition = _b[0], setWidgetPosition = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), isWidgetVisible = _c[0], setIsWidgetVisible = _c[1];
    var _d = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null), selectionTimeout = _d[0], setSelectionTimeout = _d[1];
    var _e = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(''), suggestion = _e[0], setSuggestion = _e[1];
    // Function to check if the selection is within a code editor
    var isSelectionInCodeEditor = function (selection) {
        if (!selection || selection.isCollapsed)
            return false;
        // Get the common ancestor of the selection
        var range = selection.getRangeAt(0);
        var container = range.commonAncestorContainer;
        // Check if the selection is within any of our target elements
        for (var _i = 0, _a = Object.values(SelectableElement); _i < _a.length; _i++) {
            var selector = _a[_i];
            if (container.nodeType === Node.ELEMENT_NODE &&
                container.closest(selector)) {
                return true;
            }
            if (container.nodeType === Node.TEXT_NODE &&
                container.parentElement &&
                container.parentElement.closest(selector)) {
                return true;
            }
        }
        return false;
    };
    // Function to get the position for the widget
    var getWidgetPosition = function (selection) {
        var range = selection.getRangeAt(0);
        var rect = range.getBoundingClientRect();
        // Calculate position of the widget, placing it above and centered over the selection
        // with some offset to not cover the selection
        return {
            top: window.scrollY + rect.top - 60, // 50px above the selection
            left: window.scrollX + rect.left + (rect.width / 2) - 150, // Centered (widget width is 300px)
        };
    };
    // Handle text selection changes
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        var handleSelectionChange = function () {
            var selection = window.getSelection();
            // Clear any existing timeout
            if (selectionTimeout) {
                clearTimeout(selectionTimeout);
                setSelectionTimeout(null);
            }
            // Check if there's a valid selection within a code editor
            if (selection && !selection.isCollapsed && isSelectionInCodeEditor(selection)) {
                var text_1 = selection.toString().trim();
                // Only proceed if we have meaningful text (e.g., not just whitespace)
                if (text_1.length > 0 && (0,_services_codeAnalysis__WEBPACK_IMPORTED_MODULE_3__.isCodeSnippet)(text_1)) {
                    // Set a small delay before showing the widget to avoid it appearing for very brief selections
                    var timeout = setTimeout(function () {
                        // Get suggestion for the selected code
                        var codeSuggestion = (0,_services_codeAnalysis__WEBPACK_IMPORTED_MODULE_3__.getSuggestion)(text_1);
                        setSelectedText(text_1);
                        setSuggestion(codeSuggestion);
                        setWidgetPosition(getWidgetPosition(selection));
                        setIsWidgetVisible(true);
                    }, 300);
                    setSelectionTimeout(timeout);
                }
                else {
                    setIsWidgetVisible(false);
                }
            }
            else {
                // No valid selection, but don't hide widget immediately 
                // (user might be interacting with the widget itself)
            }
        };
        // Handle mouseup to check selection (sometimes selectionchange doesn't fire as expected)
        var handleMouseUp = function () {
            // Small delay to ensure selection is complete
            setTimeout(function () {
                var selection = window.getSelection();
                if (selection && !selection.isCollapsed && isSelectionInCodeEditor(selection)) {
                    var text = selection.toString().trim();
                    if (text.length > 0 && (0,_services_codeAnalysis__WEBPACK_IMPORTED_MODULE_3__.isCodeSnippet)(text)) {
                        // Get suggestion for the selected code
                        var codeSuggestion = (0,_services_codeAnalysis__WEBPACK_IMPORTED_MODULE_3__.getSuggestion)(text);
                        setSelectedText(text);
                        setSuggestion(codeSuggestion);
                        setWidgetPosition(getWidgetPosition(selection));
                        setIsWidgetVisible(true);
                    }
                }
            }, 100);
        };
        // Attach event listeners
        document.addEventListener('selectionchange', handleSelectionChange);
        document.addEventListener('mouseup', handleMouseUp);
        return function () {
            document.removeEventListener('selectionchange', handleSelectionChange);
            document.removeEventListener('mouseup', handleMouseUp);
            if (selectionTimeout)
                clearTimeout(selectionTimeout);
        };
    }, [selectionTimeout]);
    // Handle widget dismissal
    var handleDismissWidget = function () {
        setIsWidgetVisible(false);
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_CodeSuggestionWidget__WEBPACK_IMPORTED_MODULE_2__["default"], { selectedText: selectedText, onDismiss: handleDismissWidget, position: widgetPosition, isVisible: isWidgetVisible, suggestion: suggestion }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SelectionDetector);


/***/ }),

/***/ "./src/components/CodeSuggestion/index.ts":
/*!************************************************!*\
  !*** ./src/components/CodeSuggestion/index.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodeSuggestionRoot: () => (/* reexport safe */ _CodeSuggestionRoot__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   CodeSuggestionWidget: () => (/* reexport safe */ _CodeSuggestionWidget__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   SelectionDetector: () => (/* reexport safe */ _SelectionDetector__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _CodeSuggestionWidget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CodeSuggestionWidget */ "./src/components/CodeSuggestion/CodeSuggestionWidget.tsx");
/* harmony import */ var _SelectionDetector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectionDetector */ "./src/components/CodeSuggestion/SelectionDetector.tsx");
/* harmony import */ var _CodeSuggestionRoot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CodeSuggestionRoot */ "./src/components/CodeSuggestion/CodeSuggestionRoot.tsx");





/***/ }),

/***/ "./src/services/codeAnalysis.ts":
/*!**************************************!*\
  !*** ./src/services/codeAnalysis.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   analyzeCode: () => (/* binding */ analyzeCode),
/* harmony export */   getSuggestion: () => (/* binding */ getSuggestion),
/* harmony export */   isCodeSnippet: () => (/* binding */ isCodeSnippet)
/* harmony export */ });
/**
 * Simple rules for code analysis
 * In a production environment, this would be more comprehensive
 */
var rules = [
    {
        pattern: /i\s*\+\+\s*</,
        suggestion: "Check for potential off-by-one error with increment",
        type: "warning",
        confidence: 0.7
    },
    {
        pattern: /i\s*\-\-\s*</,
        suggestion: "Check for potential off-by-one error with decrement",
        type: "warning",
        confidence: 0.7
    },
    {
        pattern: /(\w+)\s*=\s*new\s+\w+.*(?!\1\s*=\s*null)/,
        suggestion: "Potential memory leak - object created but never cleaned up",
        type: "warning",
        confidence: 0.6
    },
    {
        pattern: /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*(\w+)\.length\s*;/,
        suggestion: "Consider caching the length property outside the loop for better performance",
        type: "improvement",
        confidence: 0.8
    },
    {
        pattern: /\.push\([^)]*\)\s*.*\.push\(/,
        suggestion: "Multiple array pushes could be combined for better readability",
        type: "improvement",
        confidence: 0.5
    },
    {
        pattern: /if\s*\(\s*(\w+)\s*!==?\s*null\s*\)\s*{\s*\1\./,
        suggestion: "Consider using optional chaining (?.) for null checks",
        type: "improvement",
        confidence: 0.9
    },
    {
        pattern: /console\.log/,
        suggestion: "Remember to remove console.log statements before submission",
        type: "info",
        confidence: 0.95
    },
    {
        pattern: /=[^=]=+/,
        suggestion: "Check equality operator - did you mean === instead of ==?",
        type: "error",
        confidence: 0.8
    },
    {
        pattern: /const\s+(\w+)[^=]*=[^;]*;\s*\1\s*=/,
        suggestion: "Reassigning a constant variable will cause an error",
        type: "error",
        confidence: 0.9
    },
    {
        pattern: /if\s*\([^{]*\)\s*\w+[^{;](?!\s*[{;])/,
        suggestion: "Missing curly braces in if statement - consider adding them for clarity",
        type: "warning",
        confidence: 0.7
    },
    {
        pattern: /(\w+)\s*=\s*(\w+)/,
        suggestion: "Check variable assignment - is this the correct variable?",
        type: "info",
        confidence: 0.3
    },
    {
        pattern: /(\w+)\s*\+\+\s*;\s*return\s+\1/,
        suggestion: "Incrementing after the return won't affect the returned value",
        type: "error",
        confidence: 0.85
    }
];
/**
 * Analyzes a code snippet and returns suggestions.
 */
function analyzeCode(code) {
    // Simple code analysis logic
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var rule = rules_1[_i];
        if (rule.pattern.test(code)) {
            return {
                suggestion: rule.suggestion,
                type: rule.type,
                confidence: rule.confidence
            };
        }
    }
    // No matching rule found
    return null;
}
/**
 * Determines if the code snippet is worth analyzing.
 * This helps filter out small selections that might not be code.
 */
function isCodeSnippet(text) {
    // Trim the text and check if it has enough content to be code
    var trimmed = text.trim();
    // Check if it's too short
    if (trimmed.length < 3)
        return false;
    // Check if it contains any programming-like characters
    var codeCharacters = /[(){}\[\];=+\-*/%<>!&|^~?:]/;
    return codeCharacters.test(trimmed);
}
/**
 * Gets context-specific suggestions based on the code.
 */
function getSuggestion(code) {
    // Try to analyze the code
    var analysis = analyzeCode(code);
    // If we have a high-confidence suggestion, use it
    if (analysis && analysis.confidence > 0.6) {
        return analysis.suggestion;
    }
    // Fallback suggestions for when we can't analyze the code
    var fallbackSuggestions = [
        "Review this code for edge cases",
        "Consider optimizing this section for better performance",
        "Check for potential null or undefined values",
        "This could be simplified for better readability",
        "Ensure this logic handles all possible scenarios"
    ];
    // Return a random fallback suggestion
    var randomIndex = Math.floor(Math.random() * fallbackSuggestions.length);
    return fallbackSuggestions[randomIndex];
}


/***/ })

}]);
//# sourceMappingURL=src_components_CodeSuggestion_CodeSuggestionRoot_tsx-src_components_CodeSuggestion_index_ts.js.map