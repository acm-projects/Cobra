import React from 'react';
import ReactDOM from 'react-dom';
import { Auth } from './utils/auth';
import { writeLeetCodeUsername, saveDraftToDynamo, getHints, getCodeSnipets } from './awsFunctions.js';
import LeetCodeLoader from './components/Loading/LeetCodeLoader';
import { useAnimationFrame } from 'framer-motion';
import HintCard from './components/HintCard';
import ResourceCard from './components/ResourceCard';

// Background service worker for Cobra extension
// Type definitions for Chrome API
interface ChromeMessage {
  type: string;
  [key: string]: any;
}

interface NavigateMessage extends ChromeMessage {
  type: 'navigate';
  path: string;
  windowId?: number;
}

interface DetectPlatformMessage extends ChromeMessage {
  type: 'detectPlatform';
  platform: string;
  problemTitle: string;
}

interface ShowHintMessage extends ChromeMessage {
  type: 'showHint';
  hint: string;
}

interface CheckAuthMessage extends ChromeMessage {
  type: 'checkAuth';
}

type MessageHandler = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => boolean | void;

// Initialize extension when installed
chrome.runtime.onInstalled.addListener((): void => {
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
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab): void => {
  if (chrome.sidePanel && tab.windowId) {
    chrome.sidePanel.open({ windowId: tab.windowId }).then((): void => {
      // Ensure we start at the sign-in page
      chrome.sidePanel.setOptions({
        path: 'signin.html'
      });
    });
  }
});

let slug = "";
chrome.tabs.onUpdated.addListener(async(tabId, changeInfo, tab) => {
  //console.log(changeInfo);
  if(tab.url && tab.url.includes("leetcode.com/problems/")){
    //console.log(tab.url);
    const urlSecondHalf = tab.url.split("/problems/")[1];
    let newslug = urlSecondHalf.split("/")[0].trim();
    if(newslug !== slug){
      console.log("slug IS DIFFERENT: " + newslug);
      slug = newslug;
      console.log("fetching hints for sidepanel");
      let hint = await getHints(slug);
      let codeSnippets = await getCodeSnipets(slug);
      let discussions = await getDiscussions(slug);
      console.log("discussions fetched for sidepanel: " + discussions);
      console.log("codeSnipets fetched for sidepanel: " + codeSnippets);
      //const codeSnippetCards: JSX.Element[] = codeSnippets.map((codeSnippet: any, index: number) => {
      //  return (<HintCard key={index} type="code" hint={codeSnippet.code} title={codeSnippet.title}></HintCard>);
      //});
      console.log(codeSnippets);
      chrome.runtime.sendMessage({type: "navigatedToProblem", data: slug, hint: hint, codeSnipets: codeSnippets});
    } else {
      console.log("slug UNCHANGED: " + slug);
    }
  } else {
    console.log("not a leetcode problem page");
    return;
  }
});   

function getDiscussions(slug: string): Promise<any> {
  
  async function fetchDiscussions() {
    console.log("ATTEMPTING TO OBTAIN DISCUSSIONS...");
    let output;
    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function fetchStackOverflowQuestions(query: any) {
        await delay(300);
        try {
            let response = await fetch(`https://api.stackexchange.com/2.3/search?order=desc&sort=votes&intitle=${encodeURIComponent(query)}&site=stackoverflow`);
            let data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error("Error fetching Stack Overflow questions:", error);
            return [];
        }
    }
    function similarityScore(str1: any, str2: any) {
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();
        const words1 = str1.split(" ");
        const words2 = new Set(str2.split(" "));
        const intersection = new Set([...words1].filter(word => words2.has(word)));
        return intersection.size / Math.max(words1.size, words2.size);
    }
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log("attempting discussions for " + tabs);
        if (tabs.length === 0) {
            output = "No active tabs found.";
            return;
        }
        const tab = tabs[0];
        if(!tab.url){
          console.log("tab url is null");
          return;
        }
        if (!tab.url.includes("leetcode.com/problems/")) {
          console.log("not a leetcode problem page");
            output = "Not on a LeetCode problem page.";
            return;
        }
        const problemSlug = tab.url.split("/problems/")[1]?.split("/")[0]?.split("?")[0]?.trim();
        if (!problemSlug) {
            console.log("problem slug is null");
            output = "Unable to extract problem slug.";
            return;
        }
        let problemTitle = problemSlug.replace(/-/g, " "); // Convert slug to readable title
        // Fetch both exact title and broader concept-based questions
        let titleMatches = await fetchStackOverflowQuestions(problemTitle);
        let generalMatches = await fetchStackOverflowQuestions(problemTitle + " algorithm");
        let scoredQuestions = [
            ...titleMatches.map((item: any) => ({
                ...item,
                type: "title-based",
                relevance: similarityScore(item.title, problemTitle),
                finalScore: item.score + similarityScore(item.title, problemTitle) * 50
            })),
            ...generalMatches.map((item: any) => ({
                ...item,
                type: "concept-based",
                relevance: 0.5, // General questions have a fixed relevance
                finalScore: item.score // Only upvotes determine final score
            }))
        ];
        // Sort all questions by finalScore (higher votes + relevance)
        scoredQuestions.sort((a, b) => b.finalScore - a.finalScore);
        let selectedQuestions = [];
        let seenTopics = new Set();
        for (let question of scoredQuestions) {
            let topicKey = question.title.replace(/\b(the|of|a|an|to|is|in)\b/g, "").toLowerCase(); // Remove common words
            if (!seenTopics.has(topicKey)) {
                selectedQuestions.push(question);
                seenTopics.add(topicKey);
            }
            if (selectedQuestions.length === 3) break;
        }
        // If fewer than 3 results, add backup links
        while (selectedQuestions.length < 3) {
            const fallbackLinks = [
                { title: `Stack Overflow: LeetCode Questions`, link: `https://stackoverflow.com/questions/tagged/leetcode`, score: 0 },
                { title: `Stack Overflow: Algorithm Questions`, link: `https://stackoverflow.com/questions/tagged/algorithms`, score: 0 },
                { title: `Stack Overflow: Debugging Questions`, link: `https://stackoverflow.com/questions/tagged/debugging`, score: 0 }
            ];
            selectedQuestions.push(fallbackLinks[selectedQuestions.length]);
        }
        // Display results
        
        chrome.runtime.sendMessage({ type: "displayDiscussions", data: selectedQuestions });
        console.log("Discussions fetched successfully:", selectedQuestions);
        return selectedQuestions;
    } catch (error) {
        console.error("Error in extension:", error);
        output = "An error occurred while fetching discussions.";
    }
  };
  return fetchDiscussions();
}

let storedLeetCodeUsername = '';
let loggedInBool = false;
let username = '';
let storedCode = '';
// Handle messages
const messageHandler: MessageHandler = (message, sender, sendResponse): boolean => {
  //console.log('Background received message:', message);

  if (!loggedInBool && message.status === "DOM loaded") {
    (async () => {
      console.log(storedLeetCodeUsername);
      if(storedLeetCodeUsername!==''){
        sendResponse(false);
        return;
      }
      sendResponse(true);
      console.log("logged into leetcode");
      let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      let response = await chrome.tabs.sendMessage(tab.id!, {action: "getUsername"});
      chrome.runtime.sendMessage({type: "loggedIntoLeetCode"})
      //chrome.tabs.remove(tab.id!);
      console.log(response);
      storedLeetCodeUsername = response;
      let writeResponse = await writeLeetCodeUsername(username.toLowerCase(), storedLeetCodeUsername);
      console.log(writeResponse);
    })();

    return true; // Keep message channel open for async sendResponse
  }

  if(message.type === 'sendUsername'){
    username = message.data;
  }

  if(message.type === 'displayDiscussions'){
    console.log("recieved disccusion message: " + message.data);
  }

  if(message.type === "getUsername"){ 
    username = localStorage.getItem("username")!;
    sendResponse(username);
    return true;
  }

  if(message.type === 'sendDraft'){ 
    console.log("new draft recieved from content script");
    try {
      let code = message.data;
      console.log(code);
      storedCode = code;
      const saveDraftPromise = new Promise(async(resolve, reject)=>{
      //console.log(slug);
      await saveDraftToDynamo(username, slug, code);
      //console.log("draft saved successfully to dynamodb");
      resolve(true);
    });
    //console.log(saveDraftPromise);
    } catch (error) {
      console.error(error);
    }
  }

  if(message.type === 'getDraft'){
    console.log("getting draft from local storage");
    sendResponse(storedCode);
    return true;
  }
  

  if (message.type === 'detectPlatform') {
    const platformMessage = message as DetectPlatformMessage;
    // Store the current platform and problem information
    chrome.storage.local.set({
      currentPlatform: platformMessage.platform,
      currentProblem: platformMessage.problemTitle
    });
  }
  
  if (message.type === 'showHint') {
    const hintMessage = message as ShowHintMessage;
    // Handle hint display logic here
    console.log('Hint:', hintMessage.hint);
  }
  
  if (message.type === 'navigate') {
    const navMessage = message as NavigateMessage;
    console.log('Navigation request received:', navMessage);
    
    if (chrome.sidePanel) {
      // First ensure the sidepanel is open
      // For the Chrome sidePanel API, we must have either a tabId or windowId
      // Let's try to get the current window if windowId isn't specified
      const openSidePanel = () => {
        if (navMessage.windowId) {
          // If we have a windowId, use it directly
          return chrome.sidePanel.open({ windowId: navMessage.windowId });
        } else {
          // Otherwise, get the current window and use its id
          return chrome.windows.getCurrent().then(window => {
            if (window.id) {
              return chrome.sidePanel.open({ windowId: window.id });
            }
            throw new Error('Could not determine window ID');
          });
        }
      };
      
      openSidePanel().then((): void => {
        console.log('Side panel opened, setting path to:', navMessage.path);
        
        // Then set the path to the requested page
        chrome.sidePanel.setOptions({
          path: navMessage.path
        }).then((): void => {
          console.log('Navigation complete to:', navMessage.path);
          sendResponse({ success: true, path: navMessage.path });
        }).catch((error: Error): void => {
          console.error('Error setting sidepanel path:', error);
          sendResponse({ success: false, error: error.message });
        });
      }).catch((error: Error): void => {
        console.error('Error opening sidepanel:', error);
        sendResponse({ success: false, error: error.message });
      });
      
      return true; 
    } else {
      console.error('chrome.sidePanel API not available');
      sendResponse({ success: false, error: 'sidePanel API not available' });
    }
  }
  
  if (message.type === 'checkAuth') {
    chrome.storage.local.get('isAuthenticated', (result: { isAuthenticated?: boolean }): void => {
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

// Background script
console.log("COBRA Background Script Running");

// Store the latest code selection
let latestCodeSelection = {
  text: "",
  url: "",
  timestamp: 0
};

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script received message:", message);

  if (message.action === "leetCodeSelection") {
    // Store the selection
    latestCodeSelection = {
      text: message.text,
      url: message.url,
      timestamp: Date.now()
    };

    // Try to send it to the side panel if it exists
    try {
      chrome.runtime.sendMessage({
        action: "updateSidePanel",
        selection: latestCodeSelection
      });
    } catch (error) {
      console.log("Error sending to side panel:", error);
    }

    // Also try to open the side panel if not already open
    try {
      if (sender.tab && sender.tab.id) {
        chrome.sidePanel.setOptions({ path: "sidepanel.html" });
        
        // Get the current window to open the side panel in
        chrome.windows.getCurrent().then(currentWindow => {
          if (currentWindow.id) {
            chrome.sidePanel.open({ windowId: currentWindow.id });
            
            // Tell content script that the side panel is open
            chrome.tabs.sendMessage(sender.tab!.id!, {
              action: "openSidePanel"
            });
          }
        });
      }
    } catch (error) {
      console.log("Error opening side panel:", error);
    }
  }

  return true;
});

// Listen for side panel requests for the latest selection
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getLatestSelection") {
    sendResponse(latestCodeSelection);
  }
  return true;
});

// Export an empty React component to satisfy tsx requirements
const BackgroundComponent: React.FC = () => {
  // This component doesn't render anything
  // It's just a wrapper for the background script logic
  return null;
};

export default BackgroundComponent; 