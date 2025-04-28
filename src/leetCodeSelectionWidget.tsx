/*
import React from 'react';
import ReactDOM from 'react-dom';
import SelectionDetector from './components/CodeSuggestion/SelectionDetector';

console.log('COBRA: LeetCode Selection Widget loaded');

// Only initialize on LeetCode problem pages
if (window.location.href.includes('leetcode.com/problems/')) {
  // Function to check if the Monaco editor is loaded
  const waitForEditor = () => {
    // Check if the Monaco editor is present in the DOM
    const editorElement = document.querySelector('.monaco-editor');
    if (editorElement) {
      console.log('COBRA: LeetCode Monaco Editor found, initializing widget');
      initializeWidget();
    } else {
      // If not found, retry after a short delay
      console.log('COBRA: Waiting for LeetCode Monaco Editor to load...');
      setTimeout(waitForEditor, 1000);
    }
  };

  // Function to initialize our widget
  const initializeWidget = () => {
    // Create a container for our React app
    const container = document.createElement('div');
    container.id = 'cobra-leetcode-selection-widget-container';
    document.body.appendChild(container);

    // Mount the SelectionDetector component to the container
    ReactDOM.render(
      <React.StrictMode>
        <SelectionDetector />
      </React.StrictMode>,
      container
    );
  };

  // Start checking for the editor
  waitForEditor();
} else {
  console.log('COBRA: Not a LeetCode problem page, widget not initialized');
} 
  */