const getTitle = () => {
  let userCode;
    let lines = (document.querySelectorAll("#editor > div.flex.flex-1.flex-col.overflow-hidden.pb-2 > div.flex-1.overflow-hidden > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text > div"));
    lines.forEach(el => userCode += el.innerText + "\n");
    return userCode;
  }
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("Execute Script");
    let url = tabs[0].url;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: getTitle
    }, (result) => {
      //document.getElementById("title").innerText = result[0].result;
    });
    chrome.storage.local.get("pages", (result) => {
      let data = result.pages?.[url] || "No data saved for this page.";
      document.getElementById("title").textContent = data;
      console.log("printed user code to popup");
    });
  });

  chrome.runtime.onMessage.addListener(
    (message) => {
      document.getElementById("title").innerText = message;
    }
  );
