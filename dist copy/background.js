/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/background.tsx ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Initialize extension when installed
chrome.runtime.onInstalled.addListener(function () {
    console.log('Extension installed');
    // Set up the side panel
    if (chrome.sidePanel) {
        chrome.sidePanel.setOptions({
            enabled: true,
            path: 'signin.html'
        });
    }
});
// Handle extension icon clicks
chrome.action.onClicked.addListener(function (tab) {
    if (chrome.sidePanel && tab.windowId) {
        chrome.sidePanel.open({ windowId: tab.windowId }).then(function () {
            // Ensure we start at the sign-in page
            chrome.sidePanel.setOptions({
                path: 'signin.html'
            });
        });
    }
});
// Handle messages
var messageHandler = function (message, sender, sendResponse) {
    console.log('Background received message:', message);
    if (message.type === 'detectPlatform') {
        var platformMessage = message;
        // Store the current platform and problem information
        chrome.storage.local.set({
            currentPlatform: platformMessage.platform,
            currentProblem: platformMessage.problemTitle
        });
    }
    if (message.type === 'showHint') {
        var hintMessage = message;
        // Handle hint display logic here
        console.log('Hint:', hintMessage.hint);
    }
    if (message.type === 'navigate') {
        var navMessage_1 = message;
        console.log('Navigation request received:', navMessage_1);
        if (chrome.sidePanel) {
            // First ensure the sidepanel is open
            // For the Chrome sidePanel API, we must have either a tabId or windowId
            // Let's try to get the current window if windowId isn't specified
            var openSidePanel = function () {
                if (navMessage_1.windowId) {
                    // If we have a windowId, use it directly
                    return chrome.sidePanel.open({ windowId: navMessage_1.windowId });
                }
                else {
                    // Otherwise, get the current window and use its id
                    return chrome.windows.getCurrent().then(function (window) {
                        if (window.id) {
                            return chrome.sidePanel.open({ windowId: window.id });
                        }
                        throw new Error('Could not determine window ID');
                    });
                }
            };
            openSidePanel().then(function () {
                console.log('Side panel opened, setting path to:', navMessage_1.path);
                // Then set the path to the requested page
                chrome.sidePanel.setOptions({
                    path: navMessage_1.path
                }).then(function () {
                    console.log('Navigation complete to:', navMessage_1.path);
                    sendResponse({ success: true, path: navMessage_1.path });
                }).catch(function (error) {
                    console.error('Error setting sidepanel path:', error);
                    sendResponse({ success: false, error: error.message });
                });
            }).catch(function (error) {
                console.error('Error opening sidepanel:', error);
                sendResponse({ success: false, error: error.message });
            });
            return true;
        }
        else {
            console.error('chrome.sidePanel API not available');
            sendResponse({ success: false, error: 'sidePanel API not available' });
        }
    }
    if (message.type === 'checkAuth') {
        chrome.storage.local.get(['isAuthenticated'], function (result) {
            console.log('Auth check result:', result);
            if (!result.isAuthenticated) {
                if (chrome.sidePanel) {
                    chrome.sidePanel.setOptions({
                        path: 'signin.html'
                    });
                }
            }
            sendResponse({ isAuthenticated: !!result.isAuthenticated });
        });
        return true; // Indicates we'll send a response asynchronously
    }
    // Default response for other message types
    return false;
};
chrome.runtime.onMessage.addListener(messageHandler);
// Export an empty React component to satisfy tsx requirements
var BackgroundComponent = function () {
    // This component doesn't render anything
    // It's just a wrapper for the background script logic
    return null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BackgroundComponent);

/******/ })()
;
//# sourceMappingURL=background.js.map