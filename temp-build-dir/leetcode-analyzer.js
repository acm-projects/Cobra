// Cobra LeetCode Analyzer Content Script
console.log('[Cobra LeetCode Analyzer] Content script loaded');

// Add debugging to check manifest loading
try {
  chrome.runtime.getManifest();
  console.log('[Cobra LeetCode Analyzer] Manifest loaded successfully');
} catch (error) {
  console.error('[Cobra LeetCode Analyzer] Error loading manifest:', error);
}

// Function to communicate widget state to injected script
function injectWidgetStateScript(isMinimized) {
  const script = document.createElement('script');
  script.textContent = `window.cobraAnalyzerWidgetMinimized = ${isMinimized};`;
  document.head.appendChild(script);
  script.remove();
}

// Inject CSS directly to ensure it's applied
function injectCSS() {
  console.log('[Cobra LeetCode Analyzer] Injecting CSS directly');
  const styleElement = document.createElement('style');
  styleElement.id = 'leetcode-analyzer-styles';
  styleElement.textContent = `
    /* LeetCode Analyzer Styles */
    .leetcode-analyzer-ui {
      position: fixed;
      top: 80px;
      right: 20px;
      width: 320px;
      background-color: #1e1e1e;
      color: #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      padding: 0;
      z-index: 10000;
      max-height: 80vh;
      overflow-y: auto;
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      border: 1px solid #333;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: #252525;
      border-radius: 12px 12px 0 0;
      border-bottom: 1px solid #333;
      cursor: move;
    }
    
    .widget-content {
      padding: 16px;
    }
    
    .toggle-button, .close-button {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #888;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: color 0.2s;
    }
    
    .toggle-button:hover, .close-button:hover {
      color: #fff;
    }
    
    .leetcode-analyzer-ui h3 {
      margin: 0;
      color: #fff;
      font-size: 15px;
      font-weight: 500;
      display: flex;
      align-items: center;
    }
    
    .analyzer-icon {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #8A2BE2;
      margin-right: 10px;
      box-shadow: 0 0 6px rgba(138, 43, 226, 0.4);
    }
    
    .status-message {
      font-size: 13px;
      color: #bbb;
      margin-bottom: 12px;
      padding: 8px 12px;
      background-color: #252525;
      border-radius: 6px;
      display: flex;
      align-items: center;
    }
    
    .status-icon {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #8A2BE2;
      margin-right: 8px;
    }
    
    .analysis-content {
      font-size: 14px;
      line-height: 1.6;
      color: #e0e0e0;
      padding: 14px;
      background-color: #252525;
      border-radius: 8px;
      max-height: 400px;
      overflow-y: auto;
      box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
    }
    
    .analysis-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 10px;
      text-align: center;
      color: #888;
    }
    
    .analysis-placeholder svg {
      margin-bottom: 16px;
      opacity: 0.6;
    }
    
    .analysis-placeholder p {
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
      max-width: 240px;
    }
    
    .leetcode-analyzer-highlight {
      background-color: rgba(138, 43, 226, 0.15) !important;
      border-left: 3px solid #8A2BE2 !important;
      box-shadow: inset 0 0 0 1px rgba(138, 43, 226, 0.3) !important;
      transition: background-color 0.3s ease;
    }
    
    /* Add specific highlighting for Monaco editor */
    .monaco-editor .view-line.leetcode-analyzer-highlight {
      background-color: rgba(138, 43, 226, 0.15) !important;
      border-left: 3px solid #8A2BE2 !important;
    }
    
    /* Add more specific rules to override LeetCode styles */
    .monaco-editor .view-lines .view-line.leetcode-analyzer-highlight {
      background-color: rgba(138, 43, 226, 0.15) !important;
      border-left: 3px solid #8A2BE2 !important;
    }
  `;
  
  document.head.appendChild(styleElement);
  console.log('[Cobra LeetCode Analyzer] CSS injected successfully');
}

// Function to inject our analyzer script into the page
const injectAnalyzer = () => {
  console.log('[Cobra LeetCode Analyzer] Injecting analyzer script');
  try {
    // Create a new script element
    const script = document.createElement('script');
    // Set the source to our inject.js file
    script.src = chrome.runtime.getURL('leetcode-analyzer-inject.js');
    // Log success or failure
    script.onload = () => {
      console.log('[Cobra LeetCode Analyzer] Script loaded successfully');
      script.remove();
    };
    script.onerror = (error) => {
      console.error('[Cobra LeetCode Analyzer] Error loading script:', error);
    };
    // Add the script to the page
    (document.head || document.documentElement).appendChild(script);
    console.log('[Cobra LeetCode Analyzer] Script element added to document');
  } catch (error) {
    console.error('[Cobra LeetCode Analyzer] Error injecting script:', error);
  }
};

// Wait for LeetCode's app container to be available
const waitForLeetCodeApp = (showWidget) => {
  console.log('[Cobra LeetCode Analyzer] Waiting for LeetCode app container');
  const maxAttempts = 15;
  let attempts = 0;

  const checkApp = () => {
    attempts++;
    console.log(`[Cobra LeetCode Analyzer] Checking for app container (attempt ${attempts}/${maxAttempts})`);
    
    // Check if the app container exists or we've tried too many times
    if (document.getElementById('app')) {
      console.log('[Cobra LeetCode Analyzer] Found app container');
      // Inject our analyzer and initialize the UI
      injectAnalyzer();
      initializeUI(showWidget);
    } else if (attempts >= maxAttempts) {
      console.log('[Cobra LeetCode Analyzer] Max attempts reached, trying anyway');
      injectAnalyzer();
      initializeUI(showWidget);
    } else {
      // Try again after a short delay
      setTimeout(checkApp, 500);
    }
  };

  checkApp();
};

// Initialize the UI elements
function initializeUI(showWidget) {
  console.log('[Cobra LeetCode Analyzer] Initializing UI');
  
  // Reset the minimized state and pending analysis when initializing UI
  isWidgetMinimized = false;
  pendingAnalysisResults = null;
  
  // Set up listener for manual widget creation
  window.addEventListener('cobra-create-analyzer-widget', function() {
    console.log('[Cobra LeetCode Analyzer] Received create-widget event');
    
    // Create and show the widget
    createAnalyzerWidget(true);
    
    // Explicitly activate the analyzer
    const activateScript = document.createElement('script');
    activateScript.textContent = `
      if (window.cobraAnalyzerExplicitlyActivated !== true) {
        console.log('Explicitly activating the analyzer from create-widget event');
        window.cobraAnalyzerExplicitlyActivated = true;
        window.dispatchEvent(new CustomEvent('cobra-analyzer-explicit-activation'));
      }
    `;
    document.head.appendChild(activateScript);
    setTimeout(() => activateScript.remove(), 100);
  });
  
  // Set up listeners for code changes
  setupEventListeners();
  
  // Create the widget but don't show it initially
  createAnalyzerWidget(showWidget === true);
}

// Create the analyzer widget
function createAnalyzerWidget(showWidget) {
  // Only create the UI if it doesn't already exist
  if (!document.getElementById('leetcode-analyzer-floating-widget')) {
    console.log('[Cobra LeetCode Analyzer] Widget not found, creating it');
    
    try {
      const container = document.createElement('div');
      container.id = 'leetcode-analyzer-floating-widget';
      container.className = 'leetcode-analyzer-ui';
      container.innerHTML = `
        <div class="widget-header" id="analyzer-widget-header">
          <h3><div class="analyzer-icon"></div>Code Analyzer</h3>
          <div>
            <button id="analyzer-widget-minimize" class="toggle-button">−</button>
            <button id="analyzer-widget-close" class="close-button">×</button>
          </div>
        </div>
        <div class="widget-content" id="analyzer-widget-content">
          <div class="status-message">
            <div class="status-icon"></div>
            <span>Ready to analyze your code...</span>
          </div>
          <div class="analysis-content">
            <div class="analysis-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#8A2BE2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16V12" stroke="#8A2BE2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 8H12.01" stroke="#8A2BE2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>Start typing in the editor to see code analysis and improvement suggestions.</p>
            </div>
          </div>
        </div>
      `;
      
      // Initially hidden unless showWidget is true
      if (!showWidget) {
        container.style.display = 'none';
      }
      
      document.body.appendChild(container);
      console.log('[Cobra LeetCode Analyzer] Widget added to DOM');
      
      // Set initial widget state (not minimized)
      injectWidgetStateScript(false);
      
      // Make the widget draggable
      makeWidgetDraggable(container);
      
      // Add event listeners for the widget buttons
      document.getElementById('analyzer-widget-minimize').addEventListener('click', function() {
        const widgetContent = document.getElementById('analyzer-widget-content');
        if (widgetContent.style.display === 'none') {
          console.log('[Cobra LeetCode Analyzer] Widget expanded');
          widgetContent.style.display = 'block';
          this.textContent = '−'; // Minus sign
          
          // Update global flag to indicate widget is expanded
          injectWidgetStateScript(false);
          isWidgetMinimized = false;
          
          // Reset the status message
          const statusMessage = document.querySelector('.status-message');
          if (statusMessage) {
            statusMessage.innerHTML = `
              <div class="status-icon"></div>
              <span>Ready to analyze your code...</span>
            `;
            statusMessage.style.color = '#bbb';
          }
          
          // Display pending analysis results if available
          if (pendingAnalysisResults) {
            console.log('[Cobra LeetCode Analyzer] Displaying pending analysis results');
            _actuallyDisplayResults(pendingAnalysisResults);
            pendingAnalysisResults = null;
          } else {
            // Manually trigger an analysis if we're on a problem page and no pending results
            if (window.location.pathname.includes('/problems/')) {
              // Dispatch a custom event to trigger code analysis
              setTimeout(() => {
                // Create a synthetic event to force a new analysis
                window.dispatchEvent(new CustomEvent('cobra-leetcode-analyzer-widget-expanded'));
              }, 500);
            }
          }
        } else {
          console.log('[Cobra LeetCode Analyzer] Widget minimized, analysis paused');
          widgetContent.style.display = 'none';
          this.textContent = '+'; // Plus sign
          
          // Update global flag to indicate widget is minimized
          injectWidgetStateScript(true);
          isWidgetMinimized = true;
        }
      });
      
      document.getElementById('analyzer-widget-close').addEventListener('click', () => {
        container.style.display = 'none';
        
        // Update the button state if it exists
        const helperButton = document.getElementById('cobra-helper-button');
        if (helperButton) {
          helperButton.style.backgroundColor = '#333333';
          helperButton.style.transform = 'scale(1)';
          helperButton.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
        }
      });
      
    } catch (error) {
      console.error('[Cobra LeetCode Analyzer] Error creating widget:', error);
    }
  } else if (showWidget) {
    // If widget already exists and we want to show it
    const widget = document.getElementById('leetcode-analyzer-floating-widget');
    widget.style.display = 'block';
  }
}

// Set up event listeners for code changes
function setupEventListeners() {
  // Listen for code changes from the injected script
  window.addEventListener('cobra-leetcode-editor-changed', function(event) {
    console.log('[Cobra LeetCode Analyzer] Received code change event');
    
    // Check if the analyzer has been explicitly activated via button click
    if (!window.cobraAnalyzerExplicitlyActivated) {
      console.log('[Cobra LeetCode Analyzer] Analyzer not explicitly activated, ignoring code change');
      return;
    }
    
    // Immediately check global minimized state for early exit
    if (isWidgetMinimized) {
      console.log('[Cobra LeetCode Analyzer] Widget is minimized (global state), ignoring code change event');
      return;
    }
    
    // Check if widget exists and is not minimized
    const floatingWidget = document.getElementById('leetcode-analyzer-floating-widget');
    const widgetContent = document.getElementById('analyzer-widget-content');
    
    // Skip analysis if widget doesn't exist, is hidden, or is minimized
    if (!floatingWidget || floatingWidget.style.display === 'none' || 
        !widgetContent || widgetContent.style.display === 'none') {
      console.log('[Cobra LeetCode Analyzer] Widget is hidden or minimized, skipping analysis');
      isWidgetMinimized = true; // Update global state
      return;
    }
    
    // If this is a user-initiated typing event (not an automatic event), proceed with analysis
    // Otherwise, require explicit user interaction with the widget before analyzing
    if (event.detail.userInitiated === true) {
      // Extract the code and problem slug from the event
      const code = event.detail.code;
      const problemSlug = event.detail.problemSlug;
      
      // Validate we have what we need
      if (!code) {
        console.error('[Cobra LeetCode Analyzer] No code received');
        return;
      }
      
      if (!problemSlug) {
        console.error('[Cobra LeetCode Analyzer] No problem slug received');
        return;
      }
      
      console.log('[Cobra LeetCode Analyzer] Analyzing code for problem:', problemSlug);
      
      // Trigger the analysis
      analyzeCode(code, problemSlug);
    } else {
      console.log('[Cobra LeetCode Analyzer] Ignoring automatic event, waiting for explicit user interaction');
    }
  });
  
  // Listen for the widget expansion event
  window.addEventListener('cobra-leetcode-analyzer-widget-expanded', function() {
    console.log('[Cobra LeetCode Analyzer] Widget was expanded, requesting code for analysis');
    
    // Request the current code from the editor through the injected script
    // We need to inject a small script to get the current code
    const scriptElement = document.createElement('script');
    scriptElement.textContent = `
      try {
        // Use the stored editor reference if available
        const editor = window.cobraMonacoEditor || (() => {
          // Fallback to finding the editor if not stored
          if (window.monaco && window.monaco.editor) {
            const models = window.monaco.editor.getModels();
            if (models && models.length > 0) {
              return models[0];
            }
            
            // Then try from editors
            const editors = window.monaco.editor.getEditors();
            if (editors && editors.length > 0) {
              return editors[0].getModel();
            }
          }
          return null;
        })();
        
        // Get the current problem slug
        const getProblemSlug = () => {
          const match = window.location.pathname.match(/\\/problems\\/([^\\/]+)/);
          return match ? match[1] : null;
        };
        
        // Get the code
        const code = editor ? editor.getValue() : null;
        const problemSlug = getProblemSlug();
        
        // Dispatch an event with the code if we have it
        if (code && problemSlug) {
          window.dispatchEvent(new CustomEvent('cobra-leetcode-editor-changed', {
            detail: {
              code: code,
              problemSlug: problemSlug
            }
          }));
        }
      } catch (error) {
        console.error('[Cobra LeetCode Analyzer] Error getting code after widget expansion:', error);
      }
    `;
    
    // Add the script to the page and then remove it
    document.body.appendChild(scriptElement);
    setTimeout(() => scriptElement.remove(), 100);
  });
}

// Make the widget draggable
function makeWidgetDraggable(widget) {
  const header = document.getElementById('analyzer-widget-header');
  if (!header) return;
  
  let offsetX, offsetY, isDragging = false;
  
  header.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - widget.getBoundingClientRect().left;
    offsetY = e.clientY - widget.getBoundingClientRect().top;
    
    // Add a style to indicate dragging
    widget.style.opacity = '0.8';
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    widget.style.left = (e.clientX - offsetX) + 'px';
    widget.style.top = (e.clientY - offsetY) + 'px';
    widget.style.right = 'auto';
  });
  
  document.addEventListener('mouseup', function() {
    isDragging = false;
    widget.style.opacity = '1';
  });
}

// Function to analyze the code
function analyzeCode(code, problemSlug) {
  console.log('[Cobra LeetCode Analyzer] Analyzing code...');
  
  // Don't analyze if minimized state is set
  if (isWidgetMinimized) {
    console.log('[Cobra LeetCode Analyzer] Widget is minimized (global state), skipping analysis');
    return;
  }
  
  // Get the floating widget
  const floatingWidget = document.getElementById('leetcode-analyzer-floating-widget');
  const widgetContent = document.getElementById('analyzer-widget-content');
  
  // Don't continue if widget is hidden or minimized
  if (!floatingWidget || floatingWidget.style.display === 'none' || 
      !widgetContent || widgetContent.style.display === 'none') {
    console.log('[Cobra LeetCode Analyzer] Widget is hidden or minimized, skipping analysis');
    return;
  }
  
  // Update the status message to show loading state
  const statusMessage = floatingWidget.querySelector('.status-message');
  if (statusMessage) {
    statusMessage.innerHTML = `
      <div class="status-icon" style="background-color: #FFA500;"></div>
      <span>Analyzing your code...</span>
    `;
    statusMessage.style.color = '#ffd699';
  }
  
  // Check if we have the OpenAI API key
  chrome.storage.sync.get(['cobra_openai_key'], function(result) {
    const apiKey = 'API_KEY_GOES_HERE';
    if (!apiKey) {
      console.error('[Cobra LeetCode Analyzer] No OpenAI API key found');
      // Update status message with error
      if (statusMessage) {
        statusMessage.innerHTML = `
          <div class="status-icon" style="background-color: #f44336;"></div>
          <span>Error: No OpenAI API key found. Go to extension options to set it.</span>
        `;
        statusMessage.style.color = '#ffb3b3';
      }
      return;
    }
    
    // Use the OpenAI API
    analyzeCodeWithOpenAI(code, problemSlug, apiKey)
      .then(results => {
        console.log('[Cobra LeetCode Analyzer] Analysis result:', results);
        displayAnalysisResults(results);
      })
      .catch(error => {
        console.error('[Cobra LeetCode Analyzer] Error analyzing code:', error);
        // Update status message with error
        if (statusMessage) {
          statusMessage.innerHTML = `
            <div class="status-icon" style="background-color: #f44336;"></div>
            <span>Error analyzing code: ${error.message}</span>
          `;
          statusMessage.style.color = '#ffb3b3';
        }
      });
  });
}

// Function to call OpenAI's API for code analysis
async function analyzeCodeWithOpenAI(code, problemSlug, openaiKey) {
  // Make the API call to OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a code analysis assistant. Analyze the provided code for potential issues, optimizations, and best practices. Be concise and focus on the most important points. When mentioning line numbers, use the format "Line X:".'
        },
        {
          role: 'user',
          content: `Analyze this code for LeetCode problem ${problemSlug}:\n\n${code}`
        }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze code');
  }

  const data = await response.json();
  return {
    analysis: data.choices[0].message.content,
    lines: extractLinesFromAnalysis(data.choices[0].message.content)
  };
}

// Extract line numbers mentioned in the analysis
function extractLinesFromAnalysis(analysis) {
  const lines = [];
  
  // Match different patterns of line references
  const patterns = [
    /Line (\d+):/gi,         // "Line X:"
    /line (\d+)/gi,          // "line X"
    /line(?:s)? (\d+)/gi,    // "lines X"
    /\(line (\d+)\)/gi,      // "(line X)"
    /at line (\d+)/gi,       // "at line X"
    /on line (\d+)/gi,       // "on line X"
    /line(?:s)? (\d+)-(\d+)/gi // "lines X-Y" for ranges
  ];
  
  // Process each pattern
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(analysis)) !== null) {
      if (match[2]) {
        // This is a range pattern (lines X-Y)
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        // Add all lines in the range
        for (let i = start; i <= end; i++) {
          lines.push(i);
        }
      } else {
        lines.push(parseInt(match[1]));
      }
    }
  });
  
  // Remove duplicate line numbers
  const uniqueLines = [...new Set(lines)];
  console.log('[Cobra LeetCode Analyzer] Extracted line numbers:', uniqueLines);
  return uniqueLines;
}

// Format the analysis text for better display
function formatAnalysis(text) {
  return text
    // Add a title if there isn't one
    .replace(/^(?!(#|<h\d))/i, '<div class="analysis-title">Analysis Results</div>')
    // Convert markdown headers
    .replace(/^# (.*)/gm, '<div class="analysis-title">$1</div>')
    .replace(/^## (.*)/gm, '<div class="analysis-subtitle">$1</div>')
    // Format ordered lists with numbers
    .replace(/^(\d+)\.\s+(.*)/gm, function(match, number, content) {
      return `<div class="analysis-item"><span class="item-number">${number}.</span> ${content}</div>`;
    })
    // Convert markdown lists
    .replace(/^- (.*)/gm, '<div class="analysis-item">$1</div>')
    // Convert markdown code blocks
    .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
    // Convert markdown inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Convert markdown bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Highlight line references
    .replace(/Line (\d+):/g, '<span class="line-reference">Line $1:</span>')
    // Format common problem statements
    .replace(/(Issues|Problems|Improvements|Suggestions|Optimizations)( in | for | found in | that can be made to )(the |your |this )?(code|solution):/gi, 
             '<div class="analysis-section-title">$1 in the provided code:</div>')
    // Add spacing between paragraphs
    .replace(/\n\n/g, '<div class="paragraph-break"></div>')
    // Convert plain line breaks to HTML
    .replace(/\n/g, '<br>');
}

// Keep track of minimized state
let isWidgetMinimized = false;
let pendingAnalysisResults = null;

// Display the analysis results in the UI
function displayAnalysisResults(results) {
  const container = document.getElementById('leetcode-analyzer-floating-widget');
  if (!container) return;

  const widgetContent = document.getElementById('analyzer-widget-content');
  
  // Store the current minimized state to avoid race conditions
  const currentlyMinimized = widgetContent && widgetContent.style.display === 'none';
  isWidgetMinimized = currentlyMinimized;
  
  // If minimized, just store the results but don't display
  if (isWidgetMinimized) {
    console.log('[Cobra LeetCode Analyzer] Widget is minimized, storing results but not displaying yet');
    pendingAnalysisResults = results;
    return;
  }
  
  // Otherwise, display them
  _actuallyDisplayResults(results);
}

// The actual function to display results, only called when widget is expanded
function _actuallyDisplayResults(results) {
  const container = document.getElementById('leetcode-analyzer-floating-widget');
  if (!container) return;

  const analysisContent = container.querySelector('.analysis-content');
  if (!analysisContent) return;

  // Format and display the analysis
  analysisContent.innerHTML = `
    <style>
      .analysis-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #fff;
      }
      .analysis-subtitle {
        font-size: 15px;
        font-weight: 500;
        margin: 12px 0 8px 0;
        color: #ddd;
      }
      .analysis-section-title {
        font-size: 15px;
        font-weight: 500;
        margin: 12px 0 8px 0;
        color: #bbb;
      }
      .analysis-item {
        margin: 8px 0 8px 0;
        padding-left: 16px;
        position: relative;
      }
      .item-number {
        color: #8A2BE2;
        font-weight: 600;
        margin-right: 4px;
      }
      .paragraph-break {
        height: 8px;
      }
      .line-reference {
        color: #8A2BE2;
        font-weight: bold;
      }
    </style>
    <div class="analysis-text">
      ${formatAnalysis(results.analysis)}
    </div>
  `;

  // Update status message with success icon
  const statusMessage = container.querySelector('.status-message');
  if (statusMessage) {
    statusMessage.innerHTML = `
      <div class="status-icon" style="background-color: #4CAF50;"></div>
      <span>Analysis complete!</span>
    `;
    
    // Add success style
    statusMessage.style.color = '#b7efcd';
  }

  // Make sure widget is visible but don't change minimized state
  container.style.display = 'block';

  // Highlight the relevant code lines with retries
  tryHighlightCodeLines(results.lines, 3, 500);
}

// Function to attempt highlighting with retries
function tryHighlightCodeLines(lines, maxRetries, delay) {
  console.log(`[Cobra LeetCode Analyzer] Attempting to highlight lines (retries left: ${maxRetries})`);
  
  // Try to highlight immediately
  highlightCodeLines(lines);
  
  // Get the count of successfully highlighted lines
  const highlightedCount = document.querySelectorAll('.leetcode-analyzer-highlight').length;
  
  // If we didn't highlight any lines and we have retries left, try again after a delay
  if (highlightedCount === 0 && maxRetries > 0) {
    console.log(`[Cobra LeetCode Analyzer] No lines highlighted, retrying in ${delay}ms...`);
    setTimeout(() => {
      tryHighlightCodeLines(lines, maxRetries - 1, delay * 1.5);
    }, delay);
  } else if (highlightedCount > 0) {
    console.log(`[Cobra LeetCode Analyzer] Successfully highlighted ${highlightedCount} lines`);
  } else {
    console.log('[Cobra LeetCode Analyzer] Failed to highlight lines after all retries');
  }
}

// Highlight specific lines in the code editor
function highlightCodeLines(lines) {
  console.log('[Cobra LeetCode Analyzer] Highlighting lines:', lines);
  
  if (!lines || !lines.length) {
    console.log('[Cobra LeetCode Analyzer] No lines to highlight');
    return;
  }
  
  // Try different selectors used by LeetCode to find the code lines
  const selectors = [
    '.view-line',                 // Standard Monaco editor line
    '.monaco-editor .view-line',  // More specific Monaco selector
    '.CodeMirror-line',           // CodeMirror (sometimes used)
    '[role="presentation"] > div' // Generic role-based selector
  ];
  
  let codeLines = [];
  
  // Try each selector until we find elements
  for (const selector of selectors) {
    console.log(`[Cobra LeetCode Analyzer] Trying selector: ${selector}`);
    codeLines = document.querySelectorAll(selector);
    
    if (codeLines && codeLines.length > 0) {
      console.log(`[Cobra LeetCode Analyzer] Found ${codeLines.length} code lines with selector: ${selector}`);
      break;
    }
  }
  
  if (!codeLines || codeLines.length === 0) {
    console.error('[Cobra LeetCode Analyzer] Could not find code lines in editor');
    return;
  }
  
  // First remove all existing highlights
  codeLines.forEach(line => {
    line.classList.remove('leetcode-analyzer-highlight');
  });
  
  // Now apply highlights to the specified lines
  lines.forEach(lineNumber => {
    // LeetCode might use 0-indexed or 1-indexed lines, try both
    if (lineNumber > 0 && lineNumber <= codeLines.length) {
      // 1-indexed (most common)
      codeLines[lineNumber - 1].classList.add('leetcode-analyzer-highlight');
      console.log(`[Cobra LeetCode Analyzer] Highlighted line ${lineNumber}`);
    } else if (lineNumber >= 0 && lineNumber < codeLines.length) {
      // 0-indexed (fallback)
      codeLines[lineNumber].classList.add('leetcode-analyzer-highlight');
      console.log(`[Cobra LeetCode Analyzer] Highlighted line ${lineNumber} (0-indexed)`);
    }
  });
  
  // Add click behavior to highlighted lines (focuses editor on that line)
  document.querySelectorAll('.line-reference').forEach(ref => {
    ref.addEventListener('click', function() {
      const lineMatch = this.textContent.match(/Line (\d+)/i);
      if (lineMatch && lineMatch[1]) {
        const lineNumber = parseInt(lineMatch[1]);
        
        // Try to scroll to the line
        const line = codeLines[lineNumber - 1];
        if (line) {
          line.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add a temporary flash effect
          line.style.transition = 'background-color 0.1s';
          line.style.backgroundColor = 'rgba(138, 43, 226, 0.3)';
          setTimeout(() => {
            line.style.backgroundColor = '';
          }, 1000);
        }
      }
    });
  });
}

// Handle LeetCode navigation (it's a SPA)
let currentPath = window.location.pathname;
function checkForNavigation() {
  // Check if we've navigated to a new problem
  if (window.location.pathname !== currentPath) {
    console.log('[Cobra LeetCode Analyzer] Navigation detected - from', currentPath, 'to', window.location.pathname);
    currentPath = window.location.pathname;
    
    // Only reinitialize if we're on a problem page
    if (currentPath.includes('/problems/')) {
      console.log('[Cobra LeetCode Analyzer] On a problem page, reinitializing...');
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        waitForLeetCodeApp(false);
      }, 1000);
    }
  }
  
  // Continue checking
  setTimeout(checkForNavigation, 1000);
}

// Start navigation monitoring
checkForNavigation();

// Initialize UI when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Cobra LeetCode Analyzer] DOM fully loaded');
  
  // Inject CSS right away
  injectCSS();
  
  // Start checking for the LeetCode app container, but don't auto-show the widget
  setTimeout(() => {
    waitForLeetCodeApp(false);
  }, 500);
});

// Additional event listener for when window is completely loaded
window.addEventListener('load', function() {
  console.log('[Cobra LeetCode Analyzer] Window fully loaded');
  
  // Ensure CSS is injected
  if (!document.getElementById('leetcode-analyzer-styles')) {
    injectCSS();
  }
  
  // This is another opportunity to initialize if DOMContentLoaded didn't work
  setTimeout(() => {
    waitForLeetCodeApp(false);
  }, 1000);
}); 