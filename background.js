chrome.runtime.onInstalled.addListener(() => {
    if (chrome.sidePanel) {
      chrome.sidePanel.setOptions({
        enabled: true
      });
    }
  });
  
  chrome.action.onClicked.addListener((tab) => {
    if (chrome.sidePanel) {
      chrome.sidePanel.open({windowId: tab.windowId});
    }
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'detectPlatform') {
      chrome.storage.local.set({
        currentPlatform: message.platform,
        currentProblem: message.problemTitle
      });
    }
    return true;
  }); 