/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/

// Create the overlay for displaying hints
var overlay = document.createElement('div');
overlay.id = 'cobra-overlay';
overlay.innerHTML = "\n  <div class=\"cobra-hints\" style=\"\n    position: fixed;\n    top: 20px;\n    right: 20px;\n    background:rgb(152, 155, 226);\n    color: white;\n    padding: 15px;\n    border-radius: 8px;\n    box-shadow: 0 2px 10px rgba(0,0,0,0.2);\n    z-index: 10000;\n    font-family: 'Segoe UI', Arial, sans-serif;\n    display: none;\n  \">\n    <h3 style=\"margin: 0 0 10px 0;\">Cobra Hints</h3>\n    <div id=\"cobra-hints-content\">Loading hints...</div>\n  </div>\n";
document.body.appendChild(overlay);
/**
 * Show a hint in the overlay
 * @param hint - The hint text to display
 */
var showHint = function (hint) {
    var hintElement = document.querySelector('#cobra-hints-content');
    var hintContainer = document.querySelector('.cobra-hints');
    if (hintElement && hintContainer) {
        hintElement.textContent = hint;
        hintContainer.style.display = 'block';
        // Hide the hint after 10 seconds
        setTimeout(function () {
            hintContainer.style.display = 'none';
        }, 10000);
    }
};
// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'showHint') {
        // Display the hint in the overlay
        showHint(request.hint);
        console.log('Received hint:', request.hint);
    }
    return true;
});

/******/ })()
;
//# sourceMappingURL=content.js.map