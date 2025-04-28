// Simple content script to verify that the extension is running
console.log("COBRA EXTENSION LOADED");

// Check if we're on LeetCode
const isLeetCodePage = window.location.hostname.includes('leetcode.com');
console.log(`Is LeetCode page: ${isLeetCodePage}`);

// No visible indicator or popups are needed anymore
// The SelectionDetector component will handle everything automatically

// Simple function to show a test suggestion widget
function showTestSuggestion(selection: Selection) {
  // Remove any existing widget
  const existingWidget = document.getElementById('cobra-test-widget');
  if (existingWidget) {
    existingWidget.remove();
  }
  
  // Get position based on selection
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Create widget
  const widget = document.createElement('div');
  widget.id = 'cobra-test-widget';
  widget.style.position = 'absolute';
  widget.style.top = `${window.scrollY + rect.top - 60}px`;
  widget.style.left = `${window.scrollX + rect.left + (rect.width / 2) - 150}px`;
  widget.style.zIndex = '9999999';
  widget.style.width = '300px';
  widget.style.backgroundColor = 'white';
  widget.style.borderRadius = '10px';
  widget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
  widget.style.padding = '10px 15px';
  widget.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
  widget.style.border = '1px solid rgba(0, 0, 0, 0.05)';
  widget.style.borderTop = '3px solid #3182CE';
  
  // Add content
  widget.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
      <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #EBF8FF; color: #3182CE; display: flex; align-items: center; justify-content: center; font-size: 16px;">💡</div>
      <div style="font-weight: 500; color: #2D3748;">Consider optimizing this code</div>
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
  
  // Click outside to dismiss
  document.addEventListener('mousedown', (event) => {
    if (widget && !widget.contains(event.target as Node)) {
      widget.remove();
    }
  }, { once: true });
}

// Only initialize on LeetCode problem pages
if (isLeetCodePage && window.location.pathname.includes('/problems/')) {
  console.log("COBRA: On LeetCode problem page, selection detector will be active");
  
  // Direct DOM-based fallback for selection detection
  document.addEventListener('mouseup', () => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        const text = selection.toString().trim();
        if (text.length > 0) {
          console.log("COBRA: Text selected:", text);
          
          // Check if we're in the code editor area
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;
          const isInEditor = 
            (container.nodeType === Node.ELEMENT_NODE && 
              ((container as Element).closest('.monaco-editor') || 
               (container as Element).closest('.view-lines'))) ||
            (container.nodeType === Node.TEXT_NODE && 
              container.parentElement && 
              (container.parentElement.closest('.monaco-editor') || 
               container.parentElement.closest('.view-lines')));
          
          if (isInEditor) {
            console.log("COBRA: Selection is within code editor");
            showTestSuggestion(selection);
          } else {
            console.log("COBRA: Selection is not within code editor");
          }
        }
      }
    }, 100);
  });
} else {
  console.log("COBRA: Not on a LeetCode problem page");
} 