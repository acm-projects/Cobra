console.log('[LeetCode Analyzer] Loading content script...');

// Set default configuration - if true, we'll use AWS Lambda instead of client-side OpenAI API
const USE_AWS_LAMBDA = false;

// Function to inject our analyzer script into the page
const injectAnalyzer = () => {
  // Create a new script element
  const script = document.createElement('script');
  // Set the source to our inject.js file
  script.src = chrome.runtime.getURL('inject.js');
  // Remove the script element after it loads
  script.onload = () => script.remove();
  // Add the script to the page
  (document.head || document.documentElement).appendChild(script);
};

// Wait for LeetCode's app container to be available
const waitForLeetCodeApp = () => {
  const maxAttempts = 15;
  let attempts = 0;

  const checkApp = () => {
    // Check if the app container exists or we've tried too many times
    if (document.getElementById('app') || attempts >= maxAttempts) {
      // Inject our analyzer and initialize the UI
      injectAnalyzer();
      initializeUI();
    } else {
      // Try again after a short delay
      attempts++;
      setTimeout(checkApp, 500);
    }
  };

  checkApp();
};

// Initialize the UI elements
function initializeUI() {
  // Only create the UI if it doesn't already exist
  if (!document.getElementById('leetcode-analyzer-floating-widget')) {
    const container = document.createElement('div');
    container.id = 'leetcode-analyzer-floating-widget';
    container.className = 'leetcode-analyzer-ui';
    container.innerHTML = `
      <div class="widget-header">
        <h3>LeetCode Analyzer</h3>
        <button id="leetcode-analyzer-toggle" class="toggle-button">−</button>
      </div>
      <div class="widget-content">
        <div class="status-message">Ready to analyze your code...</div>
        <div class="analysis-content">
          <p>Start typing to see analysis...</p>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    
    // Add event listener for the toggle button
    const toggleButton = document.getElementById('leetcode-analyzer-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', function() {
        const widgetContent = container.querySelector('.widget-content');
        if (widgetContent.style.display === 'none') {
          widgetContent.style.display = 'block';
          this.textContent = '−'; // Minus sign
        } else {
          widgetContent.style.display = 'none';
          this.textContent = '+'; // Plus sign
        }
      });
    }
  }
}

// Listen for code changes from the injected script
window.addEventListener('leetCodeEditorChanged', function(event) {
  console.log('[LeetCode Analyzer] Received code change event');
  
  // Extract the code and problem slug from the event
  const code = event.detail.code;
  const problemSlug = event.detail.problemSlug;
  
  // Validate we have what we need
  if (!code) {
    console.error('[LeetCode Analyzer] No code received');
    return;
  }
  
  if (!problemSlug) {
    console.error('[LeetCode Analyzer] No problem slug received');
    return;
  }
  
  console.log('[LeetCode Analyzer] Analyzing code for problem:', problemSlug);
  
  // Trigger the analysis
  analyzeCode(code, problemSlug);
});

// Main function to analyze the code
function analyzeCode(code, problemSlug) {
  console.log('[LeetCode Analyzer] Analyzing code...');
  
  // Get the floating widget
  const floatingWidget = document.getElementById('leetcode-analyzer-floating-widget');
  if (floatingWidget) {
    // Update the status message
    const statusMessage = floatingWidget.querySelector('.status-message');
    if (statusMessage) {
      statusMessage.textContent = 'Analyzing your code...';
    }
  }

  // Check if we have the OpenAI API key
  chrome.storage.sync.get(['openaiApiKey'], function(result) {
    const apiKey = result.openaiApiKey;
    
    if (!apiKey) {
      console.error('[LeetCode Analyzer] No OpenAI API key found. Please set it in the extension options.');
      // Update status message
      if (floatingWidget) {
        const statusMessage = floatingWidget.querySelector('.status-message');
        if (statusMessage) {
          statusMessage.textContent = 'Error: No OpenAI API key found. Please set it in the extension options.';
        }
      }
      return;
    }
    
    // If we're using AWS Lambda, use that
    if (USE_AWS_LAMBDA) {
      // Here we would use our serverless backend
      console.log('[LeetCode Analyzer] Using AWS Lambda for analysis');
      
      // Make a request to the AWS Lambda function
      fetch('https://rbj7qcrszg.execute-api.us-east-1.amazonaws.com/dev/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          problemSlug: problemSlug,
          apiKey: apiKey
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('[LeetCode Analyzer] Analysis result:', data);
        displayAnalysisResults(data);
      })
      .catch(error => {
        console.error('[LeetCode Analyzer] Error analyzing code:', error);
        // Update status message
        if (floatingWidget) {
          const statusMessage = floatingWidget.querySelector('.status-message');
          if (statusMessage) {
            statusMessage.textContent = `Error analyzing code: ${error.message}`;
          }
        }
      });
    } else {
      // Otherwise use the OpenAI API directly from the client
      analyzeCodeWithOpenAI(code, problemSlug, apiKey)
        .then(results => {
          console.log('[LeetCode Analyzer] Analysis result:', results);
          displayAnalysisResults(results);
        })
        .catch(error => {
          console.error('[LeetCode Analyzer] Error analyzing code:', error);
          // Update status message
          if (floatingWidget) {
            const statusMessage = floatingWidget.querySelector('.status-message');
            if (statusMessage) {
              statusMessage.textContent = `Error analyzing code: ${error.message}`;
            }
          }
        });
    }
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
          content: 'You are a code analysis assistant. Analyze the provided code for potential issues, optimizations, and best practices. Be concise and focus on the most important points.'
        },
        {
          role: 'user',
          content: `Analyze this code for LeetCode problem ${problemSlug}:\n\n${code}`
        }
      ]
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
  const lineRegex = /line (\d+)/gi;
  let match;
  
  // Find all line number references in the analysis
  while ((match = lineRegex.exec(analysis)) !== null) {
    lines.push(parseInt(match[1]));
  }
  
  // Remove duplicate line numbers
  return [...new Set(lines)];
}

// Display the analysis results in the UI
function displayAnalysisResults(results) {
  const container = document.getElementById('leetcode-analyzer-floating-widget');
  if (!container) return;

  const analysisContent = container.querySelector('.analysis-content');
  if (!analysisContent) return;

  // Convert newlines to HTML line breaks and format analysis
  analysisContent.innerHTML = `
    <div class="analysis-text">
      ${results.analysis.replace(/\n/g, '<br>')}
    </div>
  `;

  // Update status message
  const statusMessage = container.querySelector('.status-message');
  if (statusMessage) {
    statusMessage.textContent = 'Analysis complete!';
  }

  // Make sure widget is visible
  const widgetContent = container.querySelector('.widget-content');
  if (widgetContent && widgetContent.style.display === 'none') {
    widgetContent.style.display = 'block';
    const toggleButton = document.getElementById('leetcode-analyzer-toggle');
    if (toggleButton) {
      toggleButton.textContent = '−'; // Minus sign
    }
  }

  // Highlight the relevant code lines
  highlightCodeLines(results.lines);
}

// Highlight specific lines in the code editor
function highlightCodeLines(lines) {
  const codeLines = document.querySelectorAll('.view-line');
  codeLines.forEach((line, index) => {
    if (lines.includes(index + 1)) {
      line.classList.add('leetcode-analyzer-highlight');
    } else {
      line.classList.remove('leetcode-analyzer-highlight');
    }
  });
}

// Handle LeetCode navigation (it's a SPA)
let currentPath = window.location.pathname;
function checkForNavigation() {
  // Check if we've navigated to a new problem
  if (window.location.pathname !== currentPath) {
    console.log('[LeetCode Analyzer] Navigation detected - from', currentPath, 'to', window.location.pathname);
    currentPath = window.location.pathname;
    
    // Only reinitialize if we're on a problem page
    if (currentPath.includes('/problems/')) {
      console.log('[LeetCode Analyzer] On a problem page, reinitializing...');
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        waitForLeetCodeApp();
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
  console.log('[LeetCode Analyzer] DOM fully loaded');
  
  // Start checking for the LeetCode app container
  waitForLeetCodeApp();
});

// Additional event listener for when window is completely loaded
window.addEventListener('load', function() {
  console.log('[LeetCode Analyzer] Window fully loaded');
  
  // This is another opportunity to initialize if DOMContentLoaded didn't work
  if (!document.getElementById('leetcode-analyzer-floating-widget')) {
    console.log('[LeetCode Analyzer] Widget not found on window load, trying again');
    waitForLeetCodeApp();
  }
});

// Add a function to toggle the widget visibility
function toggleWidgetVisibility() {
  const widget = document.getElementById('leetcode-analyzer-floating-widget');
  if (widget) {
    if (widget.style.display === 'none') {
      widget.style.display = 'block';
    } else {
      widget.style.display = 'none';
    }
  }
}