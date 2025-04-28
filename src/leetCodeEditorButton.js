// LeetCode Editor Helper Button
// This script adds a button to the Monaco editor in LeetCode

(function() {
  'use strict';
  
  console.log('LeetCode Editor Button: Script loaded');
  
  // Keep track of button creation attempts to prevent infinite loops
  let buttonCreationAttempts = 0;
  const MAX_ATTEMPTS = 3;
  
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
        }
        
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
      }, 1000);

      // Monitor editor changes
      window.setupEditorChangeListener = function() {
        const editor = window.findMonacoEditor();
        if (editor) {
          const model = editor.getModel();
          if (model) {
            // Create a debounced function for performance
            let timeout;
            const debouncedContentChange = (event) => {
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                const code = model.getValue();
                // Get the problem slug from the URL
                const problemSlug = window.location.pathname.split('/')[2];
                
                window.dispatchEvent(new CustomEvent('cobra-code-changed', {
                  detail: {
                    code: code,
                    problemSlug: problemSlug
                  }
                }));
              }, 1000); // Wait 1 second after typing stops
            };
            
            // Listen for content changes
            model.onDidChangeContent(debouncedContentChange);
            console.log('COBRA: Editor change listener set up');
          }
        }
      };
    `;
    document.head.appendChild(script);
  }
  
  // Setup message interface and initialize button
  function setupMessageInterface() {
    // Create button immediately for faster display
    createToolbarButton();
    
    // Listen for when the editor is found
    window.addEventListener('cobra-monaco-found', () => {
      // Recreate the button to ensure it's in the right place
      createToolbarButton();
      
      // Run the script to setup editor change listener
      const setupScript = document.createElement('script');
      setupScript.textContent = `window.setupEditorChangeListener();`;
      document.head.appendChild(setupScript);
    });
    
    // Listen for code changes
    window.addEventListener('cobra-code-changed', (event) => {
      const { code, problemSlug } = event.detail;
      // Only update if the widget is visible and we have an API key
      const widget = document.getElementById('cobra-floating-widget');
      if (widget && localStorage.getItem('cobra_openai_key')) {
        analyzeCodeWithAI(code, problemSlug);
      }
    });
    
    // Inject the script
    injectScript();
    
    // Create button after a delay as final fallback
    setTimeout(() => {
      createToolbarButton();
    }, 1000);
  }
  
  // Create a button in the top toolbar
  function createToolbarButton() {
    // Prevent too many creation attempts
    buttonCreationAttempts++;
    if (buttonCreationAttempts > MAX_ATTEMPTS) {
      console.log('Max button creation attempts reached, aborting');
      return;
    }
    
    // Remove existing button if any
    const existingButton = document.getElementById('cobra-helper-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    // Create the button element to match the toolbar style
    const button = document.createElement('button');
    button.id = 'cobra-helper-button';
    button.className = 'cobra-toolbar-button';
    
    // Use a simple purple circle as the logo
    button.innerHTML = `
      <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #8A2BE2; box-shadow: 0 0 4px rgba(138, 43, 226, 0.5);"></div>
    `;
    
    button.title = 'Cobra';
    
    // Style the button to match the screenshot
    button.style.display = 'inline-flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.minWidth = '40px';
    button.style.height = '32px';
    button.style.backgroundColor = '#333333'; // Slightly lighter background for contrast
    button.style.border = '1px solid #8A2BE2'; // Purple border to match the circle
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.padding = '4px';
    button.style.margin = '0 4px';
    button.style.fontSize = '14px';
    button.style.fontWeight = 'bold';
    button.style.transition = 'background-color 0.2s, transform 0.2s';
    button.style.zIndex = '999';
    button.style.outline = 'none';
    button.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)'; // Add subtle shadow
    
    // Try to find the toolbar in the screenshot using multiple strategies
    let toolbarPlaced = false;
    
    // Strategy 1: Look for the fullscreen button in the toolbar (rightmost element)
    try {
      // Based on the screenshot, there's a fullscreen-like button at the far right
      // Look for elements that might be that button or its container
      const fullscreenButton = document.querySelector('button[title*="full"], button[aria-label*="full"], [class*="fullscreen"]');
      if (fullscreenButton) {
        const toolbar = fullscreenButton.parentElement;
        if (toolbar) {
          // Insert before the fullscreen button (to be on the right side)
          toolbar.appendChild(button);
          toolbarPlaced = true;
          console.log('Button placed at the rightmost position in toolbar');
        }
      }
    } catch (e) {
      console.log('Error in fullscreen button strategy:', e);
    }
    
    // Strategy 2: Find the toolbar and append to it (will be rightmost position)
    if (!toolbarPlaced) {
      try {
        // From the screenshot, identify the toolbar container
        const toolbarContainer = document.querySelector('.dark-theme-container, div[style*="background-color:#1a1a1a"], .editor-navbar');
        
        if (toolbarContainer) {
          // Find all child divs that look like button containers
          const buttonContainers = Array.from(toolbarContainer.querySelectorAll('div')).filter(div => {
            // Only consider divs that contain buttons or have toolbar-like appearance
            return div.querySelector('button') || 
                   div.style.display === 'flex' || 
                   div.className.includes('actions') ||
                   div.className.includes('buttons');
          });
          
          if (buttonContainers.length > 0) {
            // Use the last container (rightmost)
            buttonContainers[buttonContainers.length - 1].appendChild(button);
            toolbarPlaced = true;
            console.log('Button placed in the rightmost button container');
          } else {
            // Just append to the toolbar container
            toolbarContainer.appendChild(button);
            toolbarPlaced = true;
            console.log('Button appended directly to toolbar container');
          }
        }
      } catch (e) {
        console.log('Error in toolbar container strategy:', e);
      }
    }
    
    // Strategy 3: Find parent of the fullscreen icon from the screenshot
    if (!toolbarPlaced) {
      try {
        // Look for square icon buttons which might be the fullscreen button
        const squareIcons = document.querySelectorAll('[class*="icon"], svg, button svg, [role="button"]');
        
        for (const icon of squareIcons) {
          if (isElementVisible(icon) && isSquarish(icon)) {
            // This might be the fullscreen icon or similar
            const parentElement = findButtonParent(icon);
            if (parentElement) {
              parentElement.appendChild(button);
              toolbarPlaced = true;
              console.log('Button placed after square icon (likely fullscreen)');
              break;
            }
          }
        }
      } catch (e) {
        console.log('Error in square icon strategy:', e);
      }
    }
    
    // Strategy 4: Find via the toolbar shown in the screenshot
    if (!toolbarPlaced) {
      try {
        // Find the top black toolbar
        const blackToolbars = Array.from(document.querySelectorAll('div')).filter(div => {
          const styles = window.getComputedStyle(div);
          const bgColor = styles.backgroundColor;
          return (bgColor === 'rgb(26, 26, 26)' || bgColor === 'rgb(40, 40, 40)' || 
                 bgColor === '#1a1a1a' || bgColor === '#282828') && 
                 div.offsetHeight <= 50 && div.offsetWidth > 300;
        });
        
        if (blackToolbars.length > 0) {
          // Sort by position (top of page first)
          const sortedToolbars = blackToolbars.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectA.top - rectB.top;
          });
          
          // Use the first (top) toolbar
          sortedToolbars[0].appendChild(button);
          toolbarPlaced = true;
          console.log('Button placed at the end of the black toolbar');
        }
      } catch (e) {
        console.log('Error in black toolbar strategy:', e);
      }
    }
    
    // Strategy 5: Fixed position at the right side of the toolbar
    if (!toolbarPlaced) {
      console.log('Using fixed position strategy at rightmost position');
      document.body.appendChild(button);
      button.style.position = 'fixed';
      button.style.top = '12px';
      button.style.right = '12px';
      toolbarPlaced = true;
    }
    
    // Add hover effect
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#444444';
      button.style.transform = 'scale(1.05)';
      button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.4)';
    });
    
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = '#333333';
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
    });
    
    // Track widget state
    let isWidgetVisible = false;
    
    // Add click handler for the button
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      
      isWidgetVisible = !isWidgetVisible;
      
      if (isWidgetVisible) {
        button.style.backgroundColor = '#444444';
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.4)';
        
        // Show floating widget
        toggleFloatingWidget(true);
      } else {
        button.style.backgroundColor = '#333333';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
        
        // Hide floating widget
        toggleFloatingWidget(false);
      }
    });
  }
  
  // Helper function to check if an element is approximately square
  function isSquarish(element) {
    const rect = element.getBoundingClientRect();
    const ratio = rect.width / rect.height;
    return (ratio >= 0.75 && ratio <= 1.25) && rect.width >= 16 && rect.height >= 16;
  }
  
  // Helper function to find the closest button or button-like parent
  function findButtonParent(element) {
    let current = element;
    const maxLevels = 4; // Don't go too far up the tree
    
    for (let i = 0; i < maxLevels; i++) {
      if (!current) return null;
      
      if (current.tagName === 'BUTTON' || 
          current.getAttribute('role') === 'button' ||
          current.className && (
            current.className.includes('button') || 
            current.className.includes('action')
          )) {
        return current.parentElement;
      }
      
      current = current.parentElement;
    }
    
    return current; // Return what we found even if it's not a button
  }
  
  // Helper function to find buttons by text
  function findButtonByText(text) {
    const elements = document.querySelectorAll('button, [role="button"], a.btn, input[type="button"]');
    
    // Find exact text match first
    for (const el of elements) {
      if (el.textContent && el.textContent.trim() === text && isElementVisible(el)) {
        return el;
      }
    }
    
    // Find contains match second
    for (const el of elements) {
      if (el.textContent && el.textContent.includes(text) && isElementVisible(el)) {
        return el;
      }
    }
    
    return null;
  }
  
  // Helper function to check if an element is visible
  function isElementVisible(el) {
    if (!el) return false;
    
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           el.offsetWidth > 0 && 
           el.offsetHeight > 0;
  }
  
  // Create or toggle the floating widget
  function toggleFloatingWidget(show) {
    // Remove any existing widget
    const existingWidget = document.getElementById('cobra-floating-widget');
    if (existingWidget) {
      existingWidget.remove();
    }
    
    if (!show) return;
    
    // Create the floating widget
    const widget = document.createElement('div');
    widget.id = 'cobra-floating-widget';
    document.body.appendChild(widget);
    
    // Style the floating widget
    Object.assign(widget.style, {
      position: 'fixed',
      right: '20px',
      top: '60px',
      width: '300px',
      backgroundColor: '#282828',
      color: '#e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      padding: '15px',
      zIndex: '9998',
      border: '1px solid #444',
      borderTop: '2px solid #8A2BE2',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      maxHeight: '80vh',
      overflowY: 'auto'
    });
    
    // Check if we have an API key
    const apiKey = localStorage.getItem('cobra_openai_key');
    
    // Add drag handle and content container
    widget.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; cursor: move;" id="cobra-widget-header">
        <div style="font-weight: 500; font-size: 14px; display: flex; align-items: center;">
          <div style="width: 14px; height: 14px; border-radius: 50%; background-color: #8A2BE2; margin-right: 8px;"></div>
          <span>Cobra</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <div id="cobra-widget-minimize" style="cursor: pointer; font-size: 14px; color: #888; padding: 0 4px;">_</div>
          <div id="cobra-widget-close" style="cursor: pointer; font-size: 14px; color: #888; padding: 0 4px;">×</div>
        </div>
      </div>
      <div id="cobra-widget-content">
        ${!apiKey ? `
          <div style="padding: 12px; border-radius: 4px; background-color: #333; margin-bottom: 12px;">
            <p style="margin: 0 0 8px 0; font-size: 13px;">Please enter your OpenAI API key:</p>
            <input type="password" id="openai-api-key" style="width: 100%; padding: 8px; margin-bottom: 8px; background: #222; border: 1px solid #555; border-radius: 4px; color: white;">
            <button id="save-api-key" style="padding: 6px 12px; background-color: #8A2BE2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">Save API Key</button>
          </div>
        ` : `
          <div id="analysis-content" style="padding: 10px; border-radius: 4px; background-color: #333; margin-bottom: 12px;">
            <p style="margin: 0; font-size: 13px;">Waiting for code changes...</p>
          </div>
          <button id="reset-api-key" style="width: 100%; padding: 4px 8px; background-color: #444; color: #aaa; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; text-align: center; margin-top: 8px;">
            Reset API Key
        </button>
        `}
      </div>
    `;
    
    // Make the widget draggable
    makeWidgetDraggable(widget);
    
    // Add event listeners for the widget buttons
    document.getElementById('cobra-widget-close').addEventListener('click', () => {
      toggleFloatingWidget(false);
    });
    
    document.getElementById('cobra-widget-minimize').addEventListener('click', () => {
      const content = document.getElementById('cobra-widget-content');
      if (content.style.display === 'none') {
        content.style.display = 'block';
        widget.style.height = 'auto';
      } else {
        content.style.display = 'none';
        widget.style.height = 'auto';
      }
    });
    
    // Add API key functionality
    if (!apiKey) {
      const saveButton = document.getElementById('save-api-key');
      if (saveButton) {
        saveButton.addEventListener('mouseover', () => {
          saveButton.style.backgroundColor = '#9D4EDD';
        });
        saveButton.addEventListener('mouseout', () => {
          saveButton.style.backgroundColor = '#8A2BE2';
        });
        saveButton.addEventListener('click', () => {
          const keyInput = document.getElementById('openai-api-key');
          if (keyInput && keyInput.value.trim()) {
            localStorage.setItem('cobra_openai_key', keyInput.value.trim());
            // Refresh widget after setting API key
            toggleFloatingWidget(true);
          }
        });
      }
    } else {
      const resetButton = document.getElementById('reset-api-key');
      if (resetButton) {
        resetButton.addEventListener('click', () => {
          localStorage.removeItem('cobra_openai_key');
          toggleFloatingWidget(true);
        });
      }
    }
    
    // If we have an API key, try to analyze code right away
    if (apiKey) {
      const editor = window.findMonacoEditor ? window.findMonacoEditor() : null;
      if (editor) {
        const model = editor.getModel();
        if (model) {
          const code = model.getValue();
          const problemSlug = window.location.pathname.split('/')[2];
          analyzeCodeWithAI(code, problemSlug);
        }
      }
    }
  }
  
  // Analyze code with OpenAI API
  async function analyzeCodeWithAI(code, problemSlug) {
    // Get API key from localStorage
    const apiKey = localStorage.getItem('cobra_openai_key');
    if (!apiKey) return;
    
    // Set loading state
    updateWidgetContent(`<div style="padding: 10px; border-radius: 4px; background-color: #333;">
      <p style="margin: 0; font-size: 13px;">Analyzing your solution...</p>
    </div>`);
    
    try {
      // Prepare prompts
      const systemPrompt = "You are an AI coding assistant integrated with LeetCode. Analyze the provided code, offering insights on correctness, efficiency, and potential improvements. Be concise and educational. When mentioning line numbers, use the format 'Line X:'. Focus on being helpful and insightful without being verbose.";
      const userPrompt = `Analyze this code for the LeetCode problem '${problemSlug}':\n\n${code}`;
      
      // Make API call to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          temperature: 0.3
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const analysis = data.choices[0].message.content;
      
      // Format the analysis for display
      const formattedAnalysis = formatAnalysis(analysis);
      
      // Update widget with the analysis
      updateWidgetContent(`<div style="padding: 12px; border-radius: 4px; background-color: #333; max-height: 300px; overflow-y: auto;">
        <div style="font-size: 13px; line-height: 1.5; color: #e0e0e0;">${formattedAnalysis}</div>
      </div>`);
      
      // Highlight lines of code mentioned in the analysis
      highlightCodeLines(analysis);
      
    } catch (error) {
      console.error('Error analyzing code:', error);
      updateWidgetContent(`<div style="padding: 10px; border-radius: 4px; background-color: #333;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #ff6b6b;">Error analyzing code:</p>
        <p style="margin: 0; font-size: 12px;">${error.message || 'Unknown error occurred'}</p>
      </div>`);
    }
  }
  
  // Format the analysis text for better display
  function formatAnalysis(text) {
    return text
      // Convert markdown headers
      .replace(/^# (.*)/gm, '<h4 style="margin: 12px 0 8px 0; color: #8A2BE2;">$1</h4>')
      .replace(/^## (.*)/gm, '<h5 style="margin: 10px 0 6px 0; color: #9D4EDD;">$1</h5>')
      
      // Convert code blocks
      .replace(/```([\s\S]*?)```/g, '<div style="background: #222; padding: 10px; border-radius: 4px; font-family: monospace; margin: 8px 0; overflow-x: auto;">$1</div>')
      
      // Convert inline code
      .replace(/`([^`]+)`/g, '<code style="background: #222; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')
      
      // Convert line number references
      .replace(/Line (\d+):/g, '<span style="font-weight: bold; color: #9D4EDD;">Line $1:</span>')
      
      // Convert normal line breaks
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }
  
  // Highlight lines of code in the editor
  function highlightCodeLines(analysis) {
    setTimeout(() => {
      try {
        // Get the editor
        const editor = window.findMonacoEditor ? window.findMonacoEditor() : null;
        if (!editor) return;
        
        // Extract line numbers from the analysis
        const lineRegex = /Line (\d+)/gi;
        const lineNumbers = [];
        let match;
        
        while ((match = lineRegex.exec(analysis)) !== null) {
          lineNumbers.push(parseInt(match[1]));
        }
        
        // Apply decorations to highlight lines
        const model = editor.getModel();
        if (!model) return;
        
        // Remove any existing decorations
        editor.deltaDecorations([], []);
        
        // Create new decorations
        const decorations = lineNumbers.map(lineNumber => ({
          range: new monaco.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            className: 'cobra-highlighted-line',
            linesDecorationsClassName: 'cobra-line-decoration'
          }
        }));
        
        // Add a style element if it doesn't exist
        let styleElement = document.getElementById('cobra-styles');
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = 'cobra-styles';
          document.head.appendChild(styleElement);
          styleElement.innerHTML = `
            .cobra-highlighted-line {
              background-color: rgba(138, 43, 226, 0.1);
              border-left: 2px solid #8A2BE2 !important;
            }
            .cobra-line-decoration {
              margin-left: 5px;
              width: 4px !important;
              background-color: #8A2BE2;
            }
          `;
        }
        
        // Apply the decorations
        editor.deltaDecorations([], decorations);
      } catch (error) {
        console.error('Error highlighting code lines:', error);
      }
    }, 500); // Delay to ensure editor is ready
  }
  
  // Update the widget content based on code changes
  function updateFloatingWidget(code, problemSlug) {
    const widget = document.getElementById('cobra-floating-widget');
    if (!widget) return;
    
    // In a real implementation, this would analyze the code and update the widget
    updateWidgetContent(`
      <div style="padding: 10px; border-radius: 4px; background-color: #333; margin-bottom: 12px;">
        <h4 style="margin: 0 0 8px 0; font-size: 14px;">Analysis for "${problemSlug}"</h4>
        <p style="margin: 0; font-size: 12px; color: #ccc;">Code length: ${code.length} characters</p>
      </div>
    `);
  }
  
  // Update the content of the widget
  function updateWidgetContent(content) {
    const contentDiv = document.getElementById('cobra-widget-content');
    if (contentDiv) {
      // Keep the buttons section
      const buttonsSection = contentDiv.querySelector('div:last-child');
      contentDiv.innerHTML = '';
      
      // If content is a string, wrap it in a div
      if (typeof content === 'string') {
        const messageDiv = document.createElement('div');
        messageDiv.style.marginBottom = '12px';
        messageDiv.innerHTML = content;
        contentDiv.appendChild(messageDiv);
      } else {
        // If it's an element, append it directly
        contentDiv.appendChild(content);
      }
      
      // Add back the buttons
      contentDiv.appendChild(buttonsSection);
    }
  }
  
  // Make the widget draggable
  function makeWidgetDraggable(widget) {
    const header = document.getElementById('cobra-widget-header');
    if (!header) return;
    
    let isDragging = false;
    let offsetX, offsetY;
    
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      const widgetRect = widget.getBoundingClientRect();
      offsetX = e.clientX - widgetRect.left;
      offsetY = e.clientY - widgetRect.top;
      
      // Add temporary event listeners for dragging
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      
      // Prevent text selection during drag
      e.preventDefault();
    });
    
    function onMouseMove(e) {
      if (!isDragging) return;
      
      // Calculate new position
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      
      // Apply new position
      widget.style.left = `${x}px`;
      widget.style.right = 'auto';
      widget.style.top = `${y}px`;
    }
    
    function onMouseUp() {
      isDragging = false;
      
      // Remove temporary event listeners
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
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