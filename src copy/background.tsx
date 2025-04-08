import React from 'react';

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

// Handle messages
const messageHandler: MessageHandler = (message, sender, sendResponse): boolean => {
  console.log('Background received message:', message);

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
    chrome.storage.local.get(['isAuthenticated'], (result: { isAuthenticated?: boolean }): void => {
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
const BackgroundComponent: React.FC = () => {
  // This component doesn't render anything
  // It's just a wrapper for the background script logic
  return null;
};

export default BackgroundComponent; 