// Injected script for LeetCode Analyzer
console.log('[Cobra LeetCode Analyzer] Injected script loaded');

// Make sure we don't initialize multiple times
window.cobraAnalyzerInitialized = window.cobraAnalyzerInitialized || false;
// Track whether the user has explicitly activated the analyzer
window.cobraAnalyzerExplicitlyActivated = false;

if (!window.cobraAnalyzerInitialized) {
  console.log('[Cobra LeetCode Analyzer] First initialization');
  window.cobraAnalyzerInitialized = true;
  
  // Function to find the Monaco editor instance
  function getMonacoEditor() {
    console.log('[Cobra LeetCode Analyzer] Trying to get Monaco editor...');
    
    // First try to get it from monaco models
    try {
      if (window.monaco && window.monaco.editor) {
        const models = window.monaco.editor.getModels();
        if (models && models.length > 0) {
          console.log('[Cobra LeetCode Analyzer] Found Monaco editor from models');
          return models[0];
        }
        
        // If no models, try to get from editors list
        const editors = window.monaco.editor.getEditors();
        if (editors && editors.length > 0) {
          console.log('[Cobra LeetCode Analyzer] Found Monaco editor from editors list');
          return editors[0].getModel();
        }
      }
    } catch (error) {
      console.error('[Cobra LeetCode Analyzer] Error while trying to get Monaco editor:', error);
    }
    
    console.log('[Cobra LeetCode Analyzer] Monaco editor not found yet');
    return null;
  }

  // Function to wait for Monaco to be available and set up the hooks
  function waitForMonaco(maxAttempts = 30, interval = 1000) {
    console.log('[Cobra LeetCode Analyzer] Waiting for Monaco editor to be available...');
    
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      console.log(`[Cobra LeetCode Analyzer] Checking for Monaco editor (attempt ${attempts}/${maxAttempts})...`);
      
      const editor = getMonacoEditor();
      
      if (editor) {
        clearInterval(checkInterval);
        console.log('[Cobra LeetCode Analyzer] Monaco editor found, storing reference');
        
        // Store the editor globally so it can be accessed when the button is clicked
        window.cobraMonacoEditor = editor;
        
        // We do NOT set up any content change listeners here - will do it only when explicitly activated
        console.log('[Cobra LeetCode Analyzer] Monaco editor stored - waiting for explicit activation');
        
        // Set up a listener for the explicit activation event
        window.addEventListener('cobra-analyzer-explicit-activation', function() {
          console.log('[Cobra LeetCode Analyzer] Explicit activation received, setting up content change listener');
          window.cobraAnalyzerExplicitlyActivated = true;
          
          // Store the initial code to detect meaningful changes
          window.cobraLastAnalyzedCode = editor.getValue();
          
          // Set up content change listener
          editor.onDidChangeContent(debounceAnalysis(editor));
          
          // Trigger initial analysis if code already exists
          if (editor.getValue().trim()) {
            console.log('[Cobra LeetCode Analyzer] Initial code detected, triggering first analysis');
            dispatchEditorChangeEvent(editor);
          }
        });
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.error('[Cobra LeetCode Analyzer] Failed to find Monaco editor after maximum attempts');
      }
    }, interval);
  }

  // Function to detect when the widget is toggled
  function setupWidgetToggleListener(editor) {
    // Use MutationObserver to detect when the widget content becomes visible
    // Since we can't directly access the minimize button from the injected script
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const widgetContent = document.getElementById('analyzer-widget-content');
          if (widgetContent && widgetContent.style.display === 'block') {
            // The widget was expanded, trigger an analysis if needed
            console.log('[Cobra LeetCode Analyzer] Widget expanded, triggering analysis if code exists');
            dispatchEditorChangeEvent(editor);
          }
        }
      });
    });
    
    // Start observing the widget content
    const widgetContent = document.getElementById('analyzer-widget-content');
    if (widgetContent) {
      observer.observe(widgetContent, { attributes: true });
    }
  }

  // Debounced function to avoid too many analysis requests
  function debounceAnalysis(editor) {
    let timer = null;
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      
      // Only set up the analysis timer if all visibility checks pass
      if (isAnalyzerVisible()) {
        timer = setTimeout(() => {
          // Check if the code has actually changed in a meaningful way
          const currentCode = editor.getValue();
          
          // Skip if the code is empty or unchanged from the last analysis
          if (!currentCode.trim()) {
            console.log('[Cobra LeetCode Analyzer] Code is empty, skipping analysis');
            return;
          }
          
          // Compare with last analyzed code to avoid redundant analyses
          if (currentCode === window.cobraLastAnalyzedCode) {
            console.log('[Cobra LeetCode Analyzer] Code unchanged since last analysis, skipping');
            return;
          }
          
          // Update the last analyzed code
          window.cobraLastAnalyzedCode = currentCode;
          
          // Dispatch the event for analysis
          dispatchEditorChangeEvent(editor);
        }, 1500); // Wait 1.5 seconds after typing stops for better responsiveness
      }
    };
  }
  
  // Function to check if the analyzer is visible and active
  function isAnalyzerVisible() {
    // First check: explicit activation
    if (!window.cobraAnalyzerExplicitlyActivated) {
      console.log('[Cobra LeetCode Analyzer] Analyzer not explicitly activated, ignoring code change');
      return false;
    }
    
    // Second check: minimized state
    if (window.cobraAnalyzerWidgetMinimized === true) {
      console.log('[Cobra LeetCode Analyzer] Widget is minimized, not dispatching events');
      return false;
    }
    
    // Third check: widget visibility
    const analyzerWidget = document.getElementById('leetcode-analyzer-floating-widget');
    if (!analyzerWidget || analyzerWidget.style.display === 'none') {
      console.log('[Cobra LeetCode Analyzer] Widget is hidden, not dispatching events');
      return false;
    }
    
    return true;
  }

  // Function to get the problem slug from the URL
  function getProblemSlug() {
    const match = window.location.pathname.match(/\/problems\/([^/]+)/);
    return match ? match[1] : null;
  }

  // Function to dispatch the editor change event
  function dispatchEditorChangeEvent(editor) {
    if (!editor) return;
    
    // Check analyzer visibility
    if (!isAnalyzerVisible()) {
      return;
    }
    
    const code = editor.getValue();
    const problemSlug = getProblemSlug();
    
    if (!code || !problemSlug) {
      console.log('[Cobra LeetCode Analyzer] Missing code or problem slug, not dispatching event');
      return;
    }
    
    console.log('[Cobra LeetCode Analyzer] Dispatching editor change event (all checks passed)');
    
    // Create and dispatch a custom event with the editor content and problem slug
    const event = new CustomEvent('cobra-leetcode-editor-changed', {
      detail: {
        code: code,
        problemSlug: problemSlug
      }
    });
    
    window.dispatchEvent(event);
  }

  // Initialize the script
  function initialize() {
    console.log('[Cobra LeetCode Analyzer] Injected script initializing');
    
    // Check if we're on a LeetCode problem page
    if (!window.location.pathname.includes('/problems/')) {
      console.log('[Cobra LeetCode Analyzer] Not on a problem page, exiting');
      return;
    }
    
    // Wait for Monaco to be available
    waitForMonaco();
    
    // Also listen for page navigation events to re-initialize if needed
    window.addEventListener('popstate', () => {
      console.log('[Cobra LeetCode Analyzer] Navigation detected, checking if re-initialization is needed');
      
      // Check if we're on a problem page
      if (window.location.pathname.includes('/problems/')) {
        console.log('[Cobra LeetCode Analyzer] On a new problem page, re-initializing');
        
        // Reset the last analyzed code on page navigation
        window.cobraLastAnalyzedCode = null;
        
        waitForMonaco();
      }
    });
  }

  // Start the script
  initialize();
} else {
  console.log('[Cobra LeetCode Analyzer] Already initialized, skipping');
} 