// Error Analysis Content Script
// This script injects the error analysis widget into LeetCode pages

console.log('Cobra Error Analysis: Content script loaded');

// Check if we're on a LeetCode problem page
if (window.location.href.includes('leetcode.com/problems/')) {
  // Wait for the page to be fully loaded before injecting our script
  window.addEventListener('load', () => {
    console.log('Cobra Error Analysis: Page loaded, initializing...');
    
    // Inject our stylesheet
    injectStylesheet();
    
    // Directly inject the widget script instead of loading external files
    injectWidgetDirectly();
    
    // Monitor for code changes
    setupCodeChangeMonitor();
    
    // Monitor for the existing Cobra button
    monitorCobraButton();
  });
}

// Function to inject our stylesheet
function injectStylesheet() {
  const style = document.createElement('style');
  style.textContent = `
    /* Error Analysis Widget Styles */
    #cobra-error-widget {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      line-height: 1.5;
      color: #e0e0e0;
      animation: fadeIn 0.3s ease-out;
    }
    
    .error-item {
      transition: background-color 0.2s ease;
    }
    
    .error-item:hover {
      background-color: rgba(255, 255, 255, 0.05) !important;
    }
    
    .error-filter-btn {
      transition: all 0.2s ease;
    }
    
    .error-filter-btn:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }
    
    #analyze-code-button {
      transition: all 0.2s ease;
    }
    
    #analyze-code-button:hover {
      background: rgba(138, 43, 226, 0.3) !important;
      transform: translateY(-1px);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  console.log('Cobra Error Analysis: Stylesheet injected directly');
}

// Function to monitor for the existing Cobra button
function monitorCobraButton() {
  // Watch for the existing Cobra helper button to appear
  const observer = new MutationObserver((mutations) => {
    const cobraButton = document.getElementById('cobra-helper-button');
    if (cobraButton && !cobraButton.dataset.errorAnalysisAttached) {
      console.log('Cobra Error Analysis: Found existing Cobra button, attaching functionality');
      
      // Mark the button so we don't attach multiple times
      cobraButton.dataset.errorAnalysisAttached = 'true';
      
      // Modify the existing widget to add our error analysis tab
      const originalClickHandler = cobraButton.onclick;
      
      cobraButton.addEventListener('click', (e) => {
        // The original handler creates the widget
        // We'll wait for it to be created and then modify it
        setTimeout(() => {
          const widget = document.getElementById('cobra-helper-widget');
          if (widget) {
            const checkButton = widget.querySelector('button#check-code-button');
            if (checkButton) {
              // Replace the Check & Fix Code button with our error analysis functionality
              checkButton.onclick = () => {
                // Hide the original widget
                const originalHideWidget = unsafeWindow.hideWidget || window.hideWidget || (() => {
                  const widget = document.getElementById('cobra-helper-widget');
                  if (widget) widget.remove();
                });
                originalHideWidget();
                
                // Get the button position for our widget
                const rect = cobraButton.getBoundingClientRect();
                const position = {
                  x: rect.left + rect.width/2,
                  y: rect.bottom + 5
                };
                
                // Show our error analysis widget
                showErrorAnalysisWidget(position);
              };
            }
          }
        }, 100);
      });
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Also check immediately in case the button already exists
  const existingButton = document.getElementById('cobra-helper-button');
  if (existingButton && !existingButton.dataset.errorAnalysisAttached) {
    setTimeout(() => monitorCobraButton(), 100);
  }
}

// Function to directly inject the widget code
function injectWidgetDirectly() {
  const script = document.createElement('script');
  script.textContent = `
    // Error Analysis Widget
    (function() {
      'use strict';
      
      console.log('Error Analysis Widget: Directly injected script loaded');
      
      // Add to window object for access from content script
      window.showErrorAnalysisWidget = showErrorAnalysisWidget;
      
      // Function to extract code from Monaco editor
      function getCodeFromEditor() {
        // Get the Monaco editor instance
        try {
          if (typeof monaco !== 'undefined') {
            const editors = monaco.editor.getEditors();
            if (editors.length > 0) {
              const editor = editors[0];
              return editor.getValue();
            }
          }
          
          // If Monaco isn't available, try to get code from textarea or pre elements
          const editorElement = document.querySelector('.CodeMirror, .monaco-editor, pre.CodeMirror-line, textarea[data-cy="code-editor"], div[data-monaco-editor-root]');
          if (editorElement) {
            if (editorElement.CodeMirror) {
              return editorElement.CodeMirror.getValue();
            } else if (editorElement.textContent) {
              return editorElement.textContent;
            } else if (editorElement.value) {
              return editorElement.value;
            }
          }
          
          // Fallback for demo
          return \`// Sample code for demo purposes
function findTarget(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}\`;
        } catch (error) {
          console.error('Error getting code from editor:', error);
          return null;
        }
      }
      
      // Function to show the error analysis widget
      function showErrorAnalysisWidget(position) {
        // Remove existing widget if any
        hideErrorWidget();
        
        // Create the widget
        const widget = document.createElement('div');
        widget.id = 'cobra-error-widget';
        document.body.appendChild(widget);
        
        // Style the widget
        widget.style.position = 'absolute';
        widget.style.left = \`\${position.x - 125}px\`;
        widget.style.top = \`\${position.y}px\`;
        widget.style.width = '300px';
        widget.style.backgroundColor = '#282828';
        widget.style.color = '#e0e0e0';
        widget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        widget.style.borderRadius = '4px';
        widget.style.zIndex = '9998';
        widget.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
        widget.style.padding = '10px';
        widget.style.border = '1px solid #444';
        widget.style.borderTop = '2px solid #8A2BE2';
        widget.style.maxHeight = '400px';
        widget.style.overflow = 'auto';
        
        // Add the header to the widget
        widget.innerHTML = \`
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="font-weight: 500; font-size: 14px; display: flex; align-items: center;">
              <div style="width: 14px; height: 14px; border-radius: 50%; background-color: #8A2BE2; margin-right: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 10px; font-weight: bold;">!</span>
              </div>
              <span>Cobra Error Analysis</span>
            </div>
            <div id="close-error-widget" style="cursor: pointer; font-size: 16px; color: #888;">×</div>
          </div>
          
          <div class="error-filters" style="display: flex; gap: 8px; margin-bottom: 12px; overflow-x: auto;">
            <button class="error-filter-btn active" style="background: rgba(138, 43, 226, 0.15); border: 1px solid #8A2BE2; color: white; border-radius: 20px; padding: 4px 10px; font-size: 12px; cursor: pointer;">All Issues</button>
            <button class="error-filter-btn" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 4px 10px; color: #94a3b8; font-size: 12px; cursor: pointer;">Errors</button>
            <button class="error-filter-btn" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 4px 10px; color: #94a3b8; font-size: 12px; cursor: pointer;">Warnings</button>
            <button class="error-filter-btn" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 4px 10px; color: #94a3b8; font-size: 12px; cursor: pointer;">Performance</button>
          </div>
          
          <div class="error-analysis-content">
            <div style="text-align: center; padding: 20px;">Analyzing code...</div>
          </div>
          
          <button id="analyze-code-button" style="width: 100%; margin-top: 12px; padding: 8px; background: rgba(138, 43, 226, 0.2); border: 1px solid #8A2BE2; color: white; border-radius: 4px; font-size: 13px; cursor: pointer;">Analyze Code Again</button>
        \`;
        
        // Add event listeners
        document.getElementById('close-error-widget').addEventListener('click', hideErrorWidget);
        
        document.getElementById('analyze-code-button').addEventListener('click', () => {
          // Get the code from editor
          const code = getCodeFromEditor();
          
          // Update the content
          const content = widget.querySelector('.error-analysis-content');
          content.innerHTML = '<div style="text-align: center; padding: 20px;">Analyzing code...</div>';
          
          // Analyze the code and display results
          setTimeout(() => {
            showMockAnalysisResults(content);
          }, 1000);
        });
        
        // Add filter functionality
        const filterButtons = widget.querySelectorAll('.error-filter-btn');
        filterButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => {
              b.style.background = 'rgba(255, 255, 255, 0.05)';
              b.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              b.style.color = '#94a3b8';
            });
            
            // Add active class to clicked button
            btn.style.background = 'rgba(138, 43, 226, 0.15)';
            btn.style.borderColor = '#8A2BE2';
            btn.style.color = 'white';
            
            // Filter the results based on the button text
            const filter = btn.textContent.trim().toLowerCase();
            filterResults(filter);
          });
        });
        
        // Analyze the code initially
        setTimeout(() => {
          showMockAnalysisResults(widget.querySelector('.error-analysis-content'));
        }, 1000);
      }
      
      // Filter results based on category
      function filterResults(filter) {
        const content = document.querySelector('.error-analysis-content');
        if (!content) return;
        
        const items = content.querySelectorAll('.error-item');
        if (!items || items.length === 0) return;
        
        items.forEach(item => {
          if (filter === 'all issues') {
            item.style.display = 'block';
          } else if (filter === 'errors' && item.style.borderLeftColor === 'rgb(244, 67, 54)') {
            item.style.display = 'block';
          } else if (filter === 'warnings' && item.style.borderLeftColor === 'rgb(255, 193, 7)') {
            item.style.display = 'block';
          } else if (filter === 'performance' && item.style.borderLeftColor === 'rgb(33, 150, 243)') {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      }
      
      // Hide the error analysis widget
      function hideErrorWidget() {
        const widget = document.getElementById('cobra-error-widget');
        if (widget) {
          widget.remove();
        }
      }
      
      // Make function available globally
      window.hideErrorWidget = hideErrorWidget;
      
      // Show mock analysis results for the demo
      function showMockAnalysisResults(contentElement) {
        contentElement.innerHTML = \`
          <div class="error-item" style="background: rgba(255, 0, 0, 0.1); border-left: 3px solid #f44336; padding: 8px; margin-bottom: 8px; border-radius: 0 4px 4px 0;">
            <div style="font-weight: 500; font-size: 13px; margin-bottom: 4px;">Off-by-One Error</div>
            <div style="font-size: 12px; color: #ddd;">Line 27: The loop should use <= instead of < to include the last element.</div>
            <pre style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; font-size: 12px; overflow-x: auto; margin: 6px 0;">for (let i = 0; i < n; i++) { ... }</pre>
            <div style="font-size: 12px; color: #aaa; margin-top: 4px;">Suggestion: Change the condition to i <= n if you need to include the nth element.</div>
          </div>
          
          <div class="error-item" style="background: rgba(255, 255, 0, 0.05); border-left: 3px solid #ffc107; padding: 8px; margin-bottom: 8px; border-radius: 0 4px 4px 0;">
            <div style="font-weight: 500; font-size: 13px; margin-bottom: 4px;">Uninitialized Variable</div>
            <div style="font-size: 12px; color: #ddd;">Line 42: The variable 'result' is used before being initialized.</div>
            <pre style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; font-size: 12px; overflow-x: auto; margin: 6px 0;">return result; // result may be undefined</pre>
            <div style="font-size: 12px; color: #aaa; margin-top: 4px;">Suggestion: Initialize result with a default value at the beginning of your function.</div>
          </div>
          
          <div class="error-item" style="background: rgba(0, 0, 255, 0.05); border-left: 3px solid #2196f3; padding: 8px; margin-bottom: 8px; border-radius: 0 4px 4px 0;">
            <div style="font-weight: 500; font-size: 13px; margin-bottom: 4px;">Memory Improvement</div>
            <div style="font-size: 12px; color: #ddd;">You're creating a new array in each iteration, which is inefficient.</div>
            <pre style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; font-size: 12px; overflow-x: auto; margin: 6px 0;">let newArray = [...array]; // Creates a copy in each iteration</pre>
            <div style="font-size: 12px; color: #aaa; margin-top: 4px;">Suggestion: Consider modifying the array in-place or creating a single copy outside the loop.</div>
          </div>
        \`;
      }
    })();
  `;
  document.body.appendChild(script);
  console.log('Cobra Error Analysis: Widget script injected directly');
}

// Function to set up a monitor for code changes
function setupCodeChangeMonitor() {
  // We'll monitor both the editor and the submit button
  
  // Wait for the Monaco editor to load
  let editorCheckInterval = setInterval(() => {
    // Look for Monaco editor
    const editorElements = document.querySelectorAll('.monaco-editor');
    if (editorElements.length > 0) {
      console.log('Cobra Error Analysis: Monaco editor found');
      clearInterval(editorCheckInterval);
      
      // Let's monitor submit button clicks
      const submitButtons = document.querySelectorAll('button[data-cy="submit-code-btn"], button:contains("Submit"), button:contains("Run")');
      if (submitButtons.length > 0) {
        submitButtons.forEach(button => {
          button.addEventListener('click', () => {
            console.log('Cobra Error Analysis: Submit button clicked, will analyze code');
            // In a real implementation, we would trigger code analysis here
          });
        });
      }
    }
  }, 1000);
  
  // Timeout after 10 seconds to avoid running indefinitely
  setTimeout(() => {
    clearInterval(editorCheckInterval);
  }, 10000);
}

// Helper function to add a "contains" selector for text content
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
} 