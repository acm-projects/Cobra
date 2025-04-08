import { NavigateMessage, SectionType } from '../types';

/**
 * Navigate to another HTML page
 * @param path Path to navigate to
 */
export const navigateToPage = async (path: string): Promise<void> => {
  try {
    const window = await chrome.windows.getCurrent();
    if (window.id) {
      chrome.runtime.sendMessage({
        type: 'navigate',
        windowId: window.id,
        path
      } as NavigateMessage);
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

/**
 * Close other windows except the current one
 * @param exceptId Window ID to exclude from closing
 */
export const closeOtherWindows = async (exceptId: number | null = null): Promise<void> => {
  try {
    const windows = await chrome.windows.getAll();
    const currentWindow = await chrome.windows.getCurrent();
    
    for (const window of windows) {
      if (window.id && window.id !== currentWindow.id && window.id !== exceptId) {
        await chrome.windows.remove(window.id);
      }
    }
  } catch (error) {
    console.error('Error closing windows:', error);
  }
}; 