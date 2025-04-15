import {handler} from "awsFunctions.js"
document.querySelector("#signup-form > div.button-group > button").addEventListener("click", () => {
    const signUpEvent = {
        "version": "1",
        "region": "us-east-1",
        "userName": "test-user-id-123",
        "callerContext": {
          "awsSdkVersion": "aws-sdk-js-2.6.4",
          "clientId": "test-client"
        },
        "triggerSource": "PostConfirmation_ConfirmSignUp",
        "request": {
          "userAttributes": {
            "sub": "test-user-id-123",
            "email": "test@example.com",
            "name": "Test User"
          }
        },
        "response": {}
      };
      handler(signUpEvent);
});

let confirmed = false;
let storedLeetCodeUsername = "";
chrome.tabs.onUpdated.addListener(function tabListener(tabId, changeInfo, tab) {
    //chrome.runtime.sendMessage("response");
    if(confirmed){
        return;
    }
    console.log("tab changed");
    console.log(changeInfo);
    if (changeInfo.title && tab.title === "LeetCode - The World's Leading Online Programming Learning Platform") {
        chrome.runtime.onMessage.addListener(async function homepageListener(message, sender, sendResponse){
            if(message.status === "DOM loaded"){
                console.log("logged into leetcode");
                let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
                let response = await chrome.tabs.sendMessage(tab.id, {action: "getUsername"});
                chrome.tabs.remove(tab.id);
                console.log(response);
                storedLeetCodeUsername = response;
                confirmed = true;
                chrome.tabs.onUpdated.removeListener(tabListener);
                chrome.runtime.onMessage.removeListener(homepageListener);
            }
        });
    }
  });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === "requestUsername"){
        console.log("popup requested username");
        sendResponse(storedLeetCodeUsername);
    }
  });