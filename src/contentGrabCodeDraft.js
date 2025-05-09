
console.log("Attempting to log changes to code...")
const target = "#editor > div.flex.flex-1.flex-col.overflow-hidden.pb-2 > div.flex-1.overflow-hidden > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text";
const config = { childList: true, subtree: true, characterData: true };

const documentObserver = new MutationObserver((mutations, obs) => {
    if(document.querySelector(target)){
        const codeObserver = new MutationObserver((codeMutations, codeObs) => {
            //console.log("something changed");
            for (const mutation of codeMutations) {
                //console.log(mutation);
                console.log(mutation.addedNodes[0].innerText);
            }
            let userCode = "";
            let n = 1;
            let lineObjects = [];
            for(const line of document.querySelector(target).childNodes){
                lineObjects.push(line);
            }
            lineObjects = lineObjects.sort((a,b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
            console.log(lineObjects);
            for(const lineObj of lineObjects){
                userCode += `line ${n}: ` + lineObj.innerText + "\n";
                n++;
            }
            chrome.runtime.sendMessage({type: "sendDraft", data:  userCode});

        });
        codeObserver.observe(document.querySelector(target), config);
        obs.disconnect();
    } else {
        console.log("waiting for code frame to load in...");
    }
});
documentObserver.observe(document, {childList: true, subtree: true});

