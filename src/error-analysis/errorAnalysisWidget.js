// Error Analysis Widget for LeetCode
// This script provides code error analysis functionality via a floating widget

(function() {
  'use strict';
  
  console.log('Error Analysis Widget: Script loaded');
  
  // Keep track of widget creation attempts to prevent infinite loops
  let widgetCreationAttempts = 0;
  const MAX_ATTEMPTS = 3;
  
  // Import our analysis code module when it's available
  let codeAnalyzer = null;
  
  // Try to load the code analyzer
  function loadCodeAnalyzer() {
    // In an actual implementation, this would properly import the module
    // For demo purposes, we'll just use our mock functions defined below
    codeAnalyzer = {
      analyzeCode: mockAnalyzeCode,
      formatAnalysisResults: mockFormatAnalysisResults
    };
  }
  
  // Create a floating button for error analysis
  function createFloatingButton() {
    // Prevent too many creation attempts
    widgetCreationAttempts++;
    if (widgetCreationAttempts > MAX_ATTEMPTS) {
      console.log('Max widget creation attempts reached, aborting');
      return;
    }
    
    // Remove existing button if any
    const existingButton = document.getElementById('cobra-error-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    // Create the button element
    const button = document.createElement('button');
    button.id = 'cobra-error-button';
    button.className = 'cobra-error-button';
    
    // Use a simple purple circle with error icon as the logo
    button.innerHTML = `
      <div style="position: relative; width: 18px; height: 18px;">
        <div style="width: 18px; height: 18px; border-radius: 50%; background-color: #8A2BE2;"></div>
        <div style="position: absolute; top: 0; left: 0; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">!</div>
      </div>
    `;
    
    button.title = 'Cobra Error Analysis';
    
    // Style the button
    button.style.display = 'inline-flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.minWidth = '32px';
    button.style.height = '32px';
    button.style.backgroundColor = '#333333';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.padding = '4px';
    button.style.margin = '0 4px';
    button.style.fontSize = '14px';
    button.style.fontWeight = 'bold';
    button.style.transition = 'background-color 0.2s';
    button.style.zIndex = '999';
    button.style.outline = 'none';
    button.style.boxShadow = 'none';
    button.style.verticalAlign = 'middle';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    
    // Add to document
    document.body.appendChild(button);
    
    // Add hover effect
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#444444';
    });
    
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = '#333333';
    });
    
    // Track widget state
    let isWidgetVisible = false;
    
    // Add click handler for the button
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      
      isWidgetVisible = !isWidgetVisible;
      
      if (isWidgetVisible) {
        button.style.backgroundColor = '#444444';
        const rect = button.getBoundingClientRect();
        const position = {
          x: rect.left - 300, // Position the widget to the left of the button
          y: rect.top - 200   // Position the widget above the button
        };
        showErrorAnalysisWidget(position);
      } else {
        button.style.backgroundColor = '#333333';
        hideWidget();
      }
    });
    
    console.log('Error Analysis button created and added to the page');
  }
  
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
      return `// Sample code for demo purposes
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
}`;
    } catch (error) {
      console.error('Error getting code from editor:', error);
      return null;
    }
  }
  
  // Function to show the error analysis widget
  function showErrorAnalysisWidget(position) {
    // Remove existing widget if any
    hideWidget();
    
    // Create the widget
    const widget = document.createElement('div');
    widget.id = 'cobra-error-widget';
    document.body.appendChild(widget);
    
    // Style the widget
    widget.style.position = 'fixed';
    widget.style.left = `${position.x}px`;
    widget.style.top = `${position.y}px`;
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
    widget.innerHTML = `
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
    `;
    
    // Add event listeners
    document.getElementById('close-error-widget').addEventListener('click', hideWidget);
    
    document.getElementById('analyze-code-button').addEventListener('click', () => {
      // Get the code from editor
      const code = getCodeFromEditor();
      
      // Update the content
      const content = widget.querySelector('.error-analysis-content');
      content.innerHTML = '<div style="text-align: center; padding: 20px;">Analyzing code...</div>';
      
      // Analyze the code and display results
      setTimeout(() => {
        if (codeAnalyzer) {
          const issues = codeAnalyzer.analyzeCode(code);
          content.innerHTML = codeAnalyzer.formatAnalysisResults(issues);
        } else {
          // Fallback to mock analysis
          showMockAnalysisResults(content);
        }
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
      const code = getCodeFromEditor();
      if (codeAnalyzer) {
        const issues = codeAnalyzer.analyzeCode(code);
        widget.querySelector('.error-analysis-content').innerHTML = codeAnalyzer.formatAnalysisResults(issues);
      } else {
        showMockAnalysisResults(widget.querySelector('.error-analysis-content'));
      }
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
  function hideWidget() {
    const widget = document.getElementById('cobra-error-widget');
    if (widget) {
      widget.remove();
    }
  }
  
  // Mock function for code analysis (used if real analyzer isn't available)
  function mockAnalyzeCode(code) {
    return [
      {
        message: 'Potential Infinite Loop',
        type: 'error',
        fix: 'Ensure the loop has a proper exit condition and increments the counter.',
        lineNumber: 23,
        codeSnippet: 'while (i < nums.length) { ... }'
      },
      {
        message: 'Edge Case Issue',
        type: 'warning',
        fix: 'Add a check for empty arrays at the beginning of your function.',
        lineNumber: 15,
        codeSnippet: 'if (nums[i] === target) { return i; }'
      },
      {
        message: 'Suboptimal Solution',
        type: 'performance',
        fix: 'Since the array is sorted, implement binary search for better performance.',
        lineNumber: 0
      }
    ];
  }
  
  // Mock function to format analysis results (used if real formatter isn't available)
  function mockFormatAnalysisResults(issues) {
    if (!issues || issues.length === 0) {
      return '<div style="padding: 10px; text-align: center;">No issues found. Great job!</div>';
    }
    
    let html = `<div style="margin-bottom: 10px; font-size: 13px;">Found ${issues.length} issues</div>`;
    
    issues.forEach(issue => {
      let bgColor;
      let borderColor;
      
      switch(issue.type) {
        case 'error':
          bgColor = 'rgba(255, 0, 0, 0.1)';
          borderColor = '#f44336';
          break;
        case 'warning':
          bgColor = 'rgba(255, 255, 0, 0.05)';
          borderColor = '#ffc107';
          break;
        case 'performance':
          bgColor = 'rgba(0, 0, 255, 0.05)';
          borderColor = '#2196f3';
          break;
        default:
          bgColor = 'rgba(100, 100, 100, 0.05)';
          borderColor = '#9e9e9e';
      }
      
      html += `<div class="error-item" style="background: ${bgColor}; border-left: 3px solid ${borderColor}; padding: 8px; margin-bottom: 8px; border-radius: 0 4px 4px 0;">
        <div style="font-weight: 500; font-size: 13px; margin-bottom: 4px;">${issue.message}</div>`;
        
      if (issue.lineNumber > 0) {
        html += `<div style="font-size: 12px; color: #ddd;">Line ${issue.lineNumber}</div>`;
      }
        
      if (issue.codeSnippet) {
        html += `<pre style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; font-size: 12px; overflow-x: auto; margin: 6px 0;">${issue.codeSnippet}</pre>`;
      }
        
      if (issue.fix) {
        html += `<div style="font-size: 12px; color: #aaa; margin-top: 4px;">Suggestion: ${issue.fix}</div>`;
      }
        
      html += `</div>`;
    });
    
    return html;
  }
  
  // Show mock analysis results for the demo
  function showMockAnalysisResults(contentElement) {
    contentElement.innerHTML = `
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
    `;
  }
  
  // Initialize the error analysis widget
  function initialize() {
    console.log('Initializing Error Analysis Widget');
    loadCodeAnalyzer();
    createFloatingButton();
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})(); 