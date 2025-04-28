import React from 'react';
import {ErrorCard} from './components/ErrorPage';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';


console.log("Attempting to log changes to code...")
const target = "#editor > div.flex.flex-1.flex-col.overflow-hidden.pb-2 > div.flex-1.overflow-hidden > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text";
const config = { childList: true, subtree: true, characterData: true };

const documentObserver = new MutationObserver((mutations, obs) => {
    if(document.querySelector(target)){        
        const codeObserver = new MutationObserver((codeMutations, codeObs) => {
            //console.log("something changed");
            for (const mutation of codeMutations) {
                //console.log(mutation);
                //console.log(mutation.addedNodes[0].innerText);
            }
            let userCode = "";
            let n = 1;
            let lineObjects = [];
            for(const line of Array.from(document.querySelector(target)!.childNodes)){
                lineObjects.push(line as HTMLElement);
            }
            lineObjects = lineObjects.sort((a,b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
            console.log(lineObjects);
            for(const lineObj of lineObjects){
                userCode += `line ${n}: ` + lineObj.innerText + "\n";
                n++;
            }
            chrome.runtime.sendMessage({type: "sendDraft", data:  userCode});

        });
        codeObserver.observe(document.querySelector(target)!, config);
        obs.disconnect();
    } else {
        console.log("waiting for code frame to load in...");
    }
});

let showErrorWidget = true;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received from background script:", request);
    if(request.type === "toggleErrorWidget") {
        showErrorWidget = request.value; // Toggle the boolean value
        console.log("Toggled showErrorWidget to:", showErrorWidget);
    } else if (request.type === "showErrorWidget" && showErrorWidget) {
        console.log("showErrorWidget message received");
        console.log(request.errors.mistakes);
        const errors = request.errors.mistakes;
        // Find the specific target element where you want to inject the widget
        let targetElement = document.querySelector(target); 
        document.getElementById('errorWidget')?.remove(); // Remove any existing widget
        let currentIndex = 0;

        let card = <ErrorCard title={errors[currentIndex].title} error={errors[currentIndex].mistakeDescription} userCode={errors[currentIndex].mistakeCode} solution="Suggested Fix:" solutionCode={errors[currentIndex].suggestedFix}/>;

        if (targetElement) {
        // Create the widget element
        let widget = document.createElement('div');
        widget.id = 'errorWidget';
        widget.innerHTML = `<div><button id="nextErrorBtn">Next Error</button><button id="closeBtn">Close</button><div id="errorCardContainer"></div></div>`;
        widget.style.position = 'absolute';
        widget.style.backgroundColor = '#f0f0f0';
        widget.style.padding = '10px';
        widget.style.border = '1px solid #ccc';
        widget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        widget.style.zIndex = '9999';
        // Position the widget relative to the target element
        let rect = targetElement.getBoundingClientRect();
        widget.style.left = `${rect.left}px`;
        widget.style.top = `${rect.top+((18*(errors[0].lineNumber))+8)}px`;  // Adjust to position the widget above the target

        document.body.appendChild(widget);
        const errorCardContainer = document.getElementById('errorCardContainer');
        const root = createRoot(errorCardContainer!);
        root.render(card);

        Object.assign(widget.style, {
            position: 'absolute',
            //top: '100px',
            //left: '100px',
            backgroundColor: 'rgba(30, 31, 44, 0.9)', // Matches the dark theme background
            padding: '16px',
            borderRadius: '12px', // Rounded corners for consistency
            border: '1px solid rgba(77, 91, 206, 0.2)', // Soft border color
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', // Soft shadow
            color: '#e3e3e3', // Light text for readability
            fontFamily: 'Inter, Arial, sans-serif', // Matching font
            fontSize: '14px',
            zIndex: '9999',
            width: '250px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          });

          const button = document.getElementById('nextErrorBtn');
            if (button) {
            Object.assign(button.style, {
                backgroundColor: 'rgba(77, 91, 206, 0.15)',
                color: '#e3e3e3',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.3s ease, transform 0.3s ease',
            });
            }
          const close = document.getElementById('closeBtn');
            if (close) {
            Object.assign(close.style, {
                backgroundColor: 'rgba(77, 91, 206, 0.15)',
                color: '#e3e3e3',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.3s ease, transform 0.3s ease',
            });
            }
          const errorContatianer = document.getElementById('errorCardContainer');
            if (errorContatianer) {
            Object.assign(errorContatianer.style, {
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '8px 16px',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
            });
            }

        document.getElementById('nextErrorBtn')!.addEventListener('click', () => {
            console.log('Next error clicked');
            currentIndex++;
            if (currentIndex >= errors.length) {
                currentIndex = 0; // Reset to the first error
            }
            console.log(errors[currentIndex]);
            // Update the widget position and content based on the current error
            widget.style.left = `${rect.left}px`;
            widget.style.top = `${rect.top+(18*(errors[currentIndex].lineNumber))+8}px`;  // Adjust to position the widget above the target
            card = <ErrorCard title={errors[currentIndex].title} error={errors[currentIndex].mistakeDescription} userCode={errors[currentIndex].mistakeCode} solution="Suggested Fix:" solutionCode={errors[currentIndex].suggestedFix}/>;
            root.render(card);
        });
        document.getElementById('closeBtn')!.addEventListener('click', () => {
            console.log('Next error clicked');
            currentIndex=0;
            console.log("closing widget...");
            widget.style.left = `${rect.left}px`;
            widget.style.top = `${rect.top+(18*(errors[currentIndex].lineNumber))+8}px`;  // Adjust to position the widget above the target
            widget.remove();
        });
        // Append widget to the body
        }
    }
});

documentObserver.observe(document, {childList: true, subtree: true});