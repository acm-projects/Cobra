/*
// LeetCode Editor Helper Button
// This script adds a button to the Monaco editor in LeetCode

(function() {
  'use strict';
  
  console.log('LeetCode Editor Button: Script loaded');
  
  // Inject script into the page to access Monaco editor API
  function injectScript() {
    console.log('Injecting Monaco access script');
    const script = document.createElement('script');
    script.textContent = `
      // Create a global access point for Monaco
      window.findMonacoEditor = function() {
        if (typeof monaco !== 'undefined') {
          const editors = monaco.editor.getEditors();
          if (editors.length > 0) {
            console.log('COBRA: Monaco editor found via global API');
            return editors[0];
          }
        }
        
        // Try to find Monaco editor instance in the DOM
        const monacoElements = document.querySelectorAll('.monaco-editor');
        if (monacoElements.length > 0) {
          console.log('COBRA: Monaco editor DOM elements found:', monacoElements.length);
          
          // Look for editor instance
          for (const key in window) {
            if (key.startsWith('__NEXT_DATA__') || key.startsWith('__reactContainer')) {
              console.log('COBRA: Checking key:', key);
            }
          }
        }
        
        console.log('COBRA: Monaco editor not found');
        return null;
      };
      
      // Notify content script when editor is found
      let editorCheckInterval = setInterval(() => {
        const editor = window.findMonacoEditor();
        if (editor) {
          console.log('COBRA: Editor found, dispatching event');
          window.dispatchEvent(new CustomEvent('cobra-monaco-found', { detail: { success: true } }));
          clearInterval(editorCheckInterval);
        }
      }, 500);
      
      // Initial check
      console.log('COBRA: Starting Monaco editor detection');
      setTimeout(window.findMonacoEditor, 1000);
    `;
    document.head.appendChild(script);
    console.log('Monaco access script injected');
  }
  
  // Create the content script interface to communicate with the injected script
  function setupMessageInterface() {
    console.log('Setting up message interface');
    
    // Listen for when the editor is found
    window.addEventListener('cobra-monaco-found', (event) => {
      console.log('Received monaco-found event:', event);
      
      // Create the button on the page
      createEditorButton();
    });
    
    // Inject the script
    injectScript();
    
    // As a fallback, also try to detect the editor directly
    detectEditorDirectly();
  }
  
  // Try to directly find the Monaco editor in the DOM
  function detectEditorDirectly() {
    console.log('Attempting to detect Monaco editor directly');
    
    // Try to find Monaco elements
    function checkForEditor() {
      const monacoElements = document.querySelectorAll('.monaco-editor, .view-lines, [data-monaco-editor-id]');
      console.log('Monaco elements found:', monacoElements.length);
      
      if (monacoElements.length > 0) {
        console.log('Monaco editor DOM elements detected, creating button');
        createEditorButton();
        return true;
      }
      return false;
    }
    
    // If initial check fails, set up interval
    if (!checkForEditor()) {
      let attempts = 0;
      const interval = setInterval(() => {
        if (checkForEditor() || attempts > 20) {
          clearInterval(interval);
        }
        attempts++;
      }, 500);
    }
  }
  
  // Create and set up the editor button
  function createEditorButton() {
    console.log('Creating editor button');
    
    // Remove existing button if any
    const existingButton = document.getElementById('cobra-helper-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    // Create the button element
    const button = document.createElement('div');
    button.id = 'cobra-helper-button';
    button.className = 'cobra-floating-button';
    button.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path></svg>`;
    button.title = 'Cobra Code Helper';
    document.body.appendChild(button);
    
    // Style the button - match Cobra colors
    button.style.position = 'absolute';
    button.style.width = '28px';
    button.style.height = '28px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#3182CE'; // Cobra blue
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.transition = 'transform 0.2s, background-color 0.2s';
    button.style.fontSize = '14px';
    button.style.fontWeight = 'bold';
    
    // Initially hide the button
    button.style.display = 'none';
    
    // Add hover effect
    button.addEventListener('mouseover', () => {
      button.style.transform = 'scale(1.1)';
      button.style.backgroundColor = '#2B6CB0'; // Darker blue on hover
    });
    
    button.addEventListener('mouseout', () => {
      button.style.transform = 'scale(1)';
      button.style.backgroundColor = '#3182CE'; // Back to original blue
    });
    
    // Track button state
    let isWidgetVisible = false;
    let lastClickPosition = { x: 0, y: 0 };
    
    // Add click handler for the button
    button.addEventListener('click', (e) => {
      console.log('Helper button clicked');
      e.stopPropagation();
      
      isWidgetVisible = !isWidgetVisible;
      
      if (isWidgetVisible) {
        button.style.backgroundColor = '#2B6CB0'; // Darker blue when active
        showHelperWidget(lastClickPosition);
      } else {
        button.style.backgroundColor = '#3182CE'; // Back to original blue
        hideHelperWidget();
      }
    });
    
    // Set up the click watcher
    setupClickWatcher(button, lastClickPosition);
  }
  
  // Set up click watching to position the button
  function setupClickWatcher(button, lastClickPosition) {
    console.log('Setting up click watcher');
    
    // Watch for clicks in the editor area
    document.addEventListener('click', (e) => {
      console.log('Document clicked:', e.target);
      
      // Check if click is in the code editor
      const isInEditor = isClickInEditor(e.target);
      if (isInEditor) {
        console.log('Click detected in editor');
        
        // Position the button near the click
        positionButtonAtClick(button, e.clientX, e.clientY);
        
        // Update last click position for widget placement
        lastClickPosition.x = e.clientX;
        lastClickPosition.y = e.clientY;
      } else {
        // If clicking outside editor and not on the button, hide it
        if (e.target !== button) {
          button.style.display = 'none';
          hideHelperWidget();
        }
      }
    });
  }
  
  // Check if an element is within the code editor
  function isClickInEditor(element) {
    // Check if element or its ancestors match editor selectors
    const editorSelectors = [
      '.monaco-editor',
      '.view-lines',
      '.monaco-mouse-cursor-text',
      '.CodeMirror',
      '[role="code"]',
      '[role="presentation"]'
    ];
    
    // Check the element and its parents
    let currentElement = element;
    while (currentElement) {
      for (const selector of editorSelectors) {
        if (currentElement.matches && currentElement.matches(selector)) {
          return true;
        }
      }
      currentElement = currentElement.parentElement;
    }
    
    return false;
  }
  
  // Position the button at the click coordinates
  function positionButtonAtClick(button, x, y) {
    button.style.left = `${x + 10}px`;
    button.style.top = `${y - 10}px`;
    button.style.display = 'flex';
    
    console.log('Button positioned at:', { x: x + 10, y: y - 10 });
  }
  
  // Show the helper widget
  function showHelperWidget(position) {
    console.log('Showing helper widget at:', position);
    
    // Remove existing widget if any
    hideHelperWidget();
    
    // Create the widget
    const widget = document.createElement('div');
    widget.id = 'cobra-helper-widget';
    document.body.appendChild(widget);
    
    // Style the widget - match Cobra design pattern
    widget.style.position = 'absolute';
    widget.style.left = `${position.x - 100}px`; // Center horizontally
    widget.style.top = `${position.y - 150}px`; // Position above the button
    widget.style.width = '240px';
    widget.style.backgroundColor = 'white';
    widget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    widget.style.borderRadius = '10px';
    widget.style.zIndex = '9998';
    widget.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
    widget.style.padding = '12px';
    widget.style.border = '1px solid rgba(0, 0, 0, 0.05)';
    widget.style.borderTop = '3px solid #3182CE'; // Cobra blue top border
    
    // Add content to the widget - Cobra style
    widget.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #EBF8FF; color: #3182CE; display: flex; align-items: center; justify-content: center; font-size: 16px;">💡</div>
        <div style="font-weight: 500; color: #2D3748; font-size: 14px;">Cobra Code Helper</div>
        <div id="close-helper-widget" style="cursor: pointer; font-size: 16px; color: #718096; margin-left: auto;">×</div>
      </div>
      <div style="margin: 8px 0; font-size: 12px; color: #4A5568;">
        What would you like to do with this code?
      </div>
      <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 10px;">
        <button id="check-code-button" style="width: 100%; padding: 8px 14px; background-color: #3182CE; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <span>Check & Fix Code</span>
        </button>
        <button id="optimize-code-button" style="width: 100%; padding: 8px 14px; background-color: #3182CE; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <span>Optimize Solution</span>
        </button>
        <button id="explain-code-button" style="width: 100%; padding: 8px 14px; background-color: #3182CE; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <span>Explain Code</span>
        </button>
        <div style="display: flex; gap: 8px; margin-top: 4px;">
          <button id="view-docs-button" style="flex: 1; padding: 8px 14px; background-color: white; color: #4A5568; border: 1px solid #E2E8F0; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span>View Docs</span>
          </button>
          <button id="dismiss-button" style="flex: 1; padding: 8px 14px; background-color: white; color: #4A5568; border: 1px solid #E2E8F0; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span>Dismiss</span>
          </button>
        </div>
      </div>
    `;
    
    // Add event listeners
    setTimeout(() => {
      // Close button
      document.getElementById('close-helper-widget').addEventListener('click', () => {
        hideHelperWidget();
      });
      
      // Dismiss button
      document.getElementById('dismiss-button').addEventListener('click', () => {
        hideHelperWidget();
      });
      
      // Action buttons
      document.getElementById('check-code-button').addEventListener('click', () => {
        alert('Checking code with Cobra...');
        hideHelperWidget();
      });
      
      document.getElementById('optimize-code-button').addEventListener('click', () => {
        alert('Optimizing code with Cobra...');
        hideHelperWidget();
      });
      
      document.getElementById('explain-code-button').addEventListener('click', () => {
        alert('Explaining code with Cobra...');
        hideHelperWidget();
      });
      
      document.getElementById('view-docs-button').addEventListener('click', () => {
        alert('Opening documentation...');
        hideHelperWidget();
      });
      
      // Add hover effects to all buttons
      const buttons = widget.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.id === 'view-docs-button' || btn.id === 'dismiss-button') {
          // Hover for secondary buttons
          btn.addEventListener('mouseover', () => {
            btn.style.backgroundColor = '#F7FAFC';
            btn.style.borderColor = '#CBD5E0';
          });
          btn.addEventListener('mouseout', () => {
            btn.style.backgroundColor = 'white';
            btn.style.borderColor = '#E2E8F0';
          });
        } else {
          // Hover for primary buttons
          btn.addEventListener('mouseover', () => {
            btn.style.backgroundColor = '#2B6CB0'; // Darker blue on hover
          });
          btn.addEventListener('mouseout', () => {
            btn.style.backgroundColor = '#3182CE'; // Back to original blue
          });
        }
      });
    }, 0);
  }
  
  // Hide the helper widget
  function hideHelperWidget() {
    const widget = document.getElementById('cobra-helper-widget');
    if (widget) {
      widget.remove();
    }
  }
  
  // Start the process when page is ready
  function initialize() {
    console.log('Initializing LeetCode editor button');
    setupMessageInterface();
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})(); 
*/