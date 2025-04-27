/*
// This script will be directly injected into the page
console.log("COBRA INJECT SCRIPT LOADED");
          
// Define a function to show the widget
function showCobraWidget(text, rect) {
    // Remove any existing widget
  const existingWidget = document.getElementById('cobra-selection-widget');
    if (existingWidget) {
      existingWidget.remove();
    }

  // Create widget
    const widget = document.createElement('div');
  widget.id = 'cobra-selection-widget';
    widget.style.position = 'absolute';
  widget.style.top = `${window.scrollY + rect.top - 60}px`;
  widget.style.left = `${window.scrollX + rect.left + (rect.width / 2) - 150}px`;
  widget.style.zIndex = '999999999';
  widget.style.width = '300px';
  widget.style.backgroundColor = 'white';
  widget.style.borderRadius = '10px';
  widget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
  widget.style.padding = '10px 15px';
  widget.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
  widget.style.border = '1px solid rgba(0, 0, 0, 0.05)';
  widget.style.borderTop = '3px solid #3182CE';

    widget.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
      <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #EBF8FF; color: #3182CE; display: flex; align-items: center; justify-content: center; font-size: 16px;">💡</div>
      <div style="font-weight: 500; color: #2D3748;">Consider optimizing this code: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"</div>
        </div>
    <div style="display: flex; gap: 10px; margin-top: 10px;">
      <button id="cobra-fix-button" style="flex: 1; padding: 8px 14px; background-color: #3182CE; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Fix this issue</button>
      <button id="cobra-dismiss-button" style="padding: 8px 14px; background-color: white; color: #4A5568; border: 1px solid #E2E8F0; border-radius: 6px; font-weight: 600; cursor: pointer;">Ignore</button>
      </div>
    `;

  // Add to page
    document.body.appendChild(widget);

    // Add dismiss handler
  const dismissButton = widget.querySelector('#cobra-dismiss-button');
    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
      widget.remove();
      });
    }
    
  // Handle click outside
  document.addEventListener('mousedown', function handleClickOutside(event) {
    if (widget && !widget.contains(event.target)) {
      widget.remove();
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });
  }

// Function to check if an element is within the code editor
function isInCodeEditor(element) {
  if (!element) return false;
  
  // Debug the element hierarchy
  console.log("Checking element:", element);
      
  // Try all possible selectors for LeetCode's code editor
  const codeEditorSelectors = [
    '.monaco-editor',
    '.view-lines',
    '.monaco-mouse-cursor-text',
    '.CodeMirror',
    'div[role="code"]',
    'div[role="presentation"]'
  ];
  
  for (const selector of codeEditorSelectors) {
    if (element.matches && element.matches(selector)) {
      console.log(`Matched selector: ${selector}`);
      return true;
  }
  
    if (element.closest && element.closest(selector)) {
      console.log(`Parent matched selector: ${selector}`);
      return true;
    }
  }
  
  // If element is a text node, check its parent
  if (element.nodeType === 3 && element.parentElement) {
    return isInCodeEditor(element.parentElement);
          }
  
  return false;
  }

// Set up selection detection
document.addEventListener('mouseup', () => {
  // Wait a bit to ensure selection is complete
        setTimeout(() => {
          const selection = window.getSelection();
    if (!selection) return;
    
    console.log("Selection detected:", selection);
    
    if (selection.isCollapsed) {
      console.log("Selection is collapsed (no text selected)");
      return;
  }

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      console.log("No text in selection");
      return;
    }
    
    console.log("Selected text:", selectedText);
                
    // Get selection container
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    console.log("Selection container:", container);
      
    // Check if selection is in code editor
    if (isInCodeEditor(container)) {
      console.log("Selection is in code editor!");
      const rect = range.getBoundingClientRect();
      showCobraWidget(selectedText, rect);
                } else {
      console.log("Selection is NOT in code editor");
    
      // Log parent chain for debugging
      let parent = container;
      let parentChain = [];
      
      while (parent && parentChain.length < 10) {
        parentChain.push(parent.nodeName + (parent.className ? ` (${parent.className})` : ''));
        parent = parent.parentElement;
      }
      
      console.log("Parent chain:", parentChain);
    }
  }, 100);
});

// Log initial page information
console.log("Page URL:", window.location.href);
console.log("Is LeetCode:", window.location.hostname.includes('leetcode.com'));
console.log("Is problem page:", window.location.pathname.includes('/problems/'));
  
// Log available code editor elements
const editorElements = {
  monaco: document.querySelectorAll('.monaco-editor'),
  viewLines: document.querySelectorAll('.view-lines'),
  monacoMouse: document.querySelectorAll('.monaco-mouse-cursor-text'),
  codeMirror: document.querySelectorAll('.CodeMirror'),
  roleCode: document.querySelectorAll('[role="code"]'),
  rolePresentation: document.querySelectorAll('[role="presentation"]')
};

console.log("Editor elements found:", {
  monaco: editorElements.monaco.length,
  viewLines: editorElements.viewLines.length,
  monacoMouse: editorElements.monacoMouse.length,
  codeMirror: editorElements.codeMirror.length,
  roleCode: editorElements.roleCode.length,
  rolePresentation: editorElements.rolePresentation.length
}); 
*/