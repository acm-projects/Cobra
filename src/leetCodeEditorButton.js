/*
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
    
    // Directly embed text "Cobra" with appropriate styling
    button.innerHTML = `
      <span style="font-weight: bold; font-size: 16px; color: white; letter-spacing: 0.5px; text-shadow: 0 0 2px #111;">Co<span style="color: #4CAF50;">bra</span></span>
    `;
    
    button.title = 'Cobra Code Helper';
    
    // Style the button to match the screenshot
    button.style.display = 'inline-flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.minWidth = '40px';
    button.style.height = '32px';
    button.style.backgroundColor = '#333333'; // Slightly lighter background for contrast
    button.style.border = '1px solid #6FCF97'; // Use green border color matching the SVG
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
        const rect = button.getBoundingClientRect();
        const position = {
          x: rect.left + (rect.width / 2),
          y: rect.bottom + 5
        };
        showToolbarWidget(position);
      } else {
        button.style.backgroundColor = '#333333';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
        hideWidget();
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
  
  // Show a widget below the toolbar
  function showToolbarWidget(position) {
    // Remove existing widget if any
    hideWidget();
    
    // Create the widget
    const widget = document.createElement('div');
    widget.id = 'cobra-helper-widget';
    document.body.appendChild(widget);
    
    // Style the widget
    widget.style.position = 'absolute';
    widget.style.left = `${position.x - 125}px`;
    widget.style.top = `${position.y}px`;
    widget.style.width = '250px';
    widget.style.backgroundColor = '#282828';
    widget.style.color = '#e0e0e0';
    widget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
    widget.style.borderRadius = '4px';
    widget.style.zIndex = '9998';
    widget.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
    widget.style.padding = '10px';
    widget.style.border = '1px solid #444';
    widget.style.borderTop = '2px solid #1e88e5';
    
    // Add content to the widget with text-based logo matching the button
    widget.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <div style="font-weight: 500; font-size: 14px; display: flex; align-items: center;">
          <span style="font-weight: bold; font-size: 14px; color: white; letter-spacing: 0.5px; margin-right: 6px; text-shadow: 0 0 2px #111;">Co<span style="color: #4CAF50;">bra</span></span>
          <span>Code Helper</span>
        </div>
        <div id="close-helper-widget" style="cursor: pointer; font-size: 16px; color: #888;">×</div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr; gap: 6px;">
        <button id="check-code-button" style="width: 100%; padding: 6px 10px; background-color: #333; color: #e0e0e0; border: 1px solid #555; border-radius: 4px; font-weight: 500; cursor: pointer; font-size: 12px; text-align: left;">
          Check & Fix Code
        </button>
        <button id="optimize-code-button" style="width: 100%; padding: 6px 10px; background-color: #333; color: #e0e0e0; border: 1px solid #555; border-radius: 4px; font-weight: 500; cursor: pointer; font-size: 12px; text-align: left;">
          Optimize Solution
        </button>
        <button id="explain-code-button" style="width: 100%; padding: 6px 10px; background-color: #333; color: #e0e0e0; border: 1px solid #555; border-radius: 4px; font-weight: 500; cursor: pointer; font-size: 12px; text-align: left;">
          Explain Code
        </button>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('close-helper-widget').addEventListener('click', hideWidget);
    
    document.getElementById('check-code-button').addEventListener('click', () => {
      alert('Checking code with Cobra...');
      hideWidget();
    });
    
    document.getElementById('optimize-code-button').addEventListener('click', () => {
      alert('Optimizing code with Cobra...');
      hideWidget();
    });
    
    document.getElementById('explain-code-button').addEventListener('click', () => {
      alert('Explaining code with Cobra...');
      hideWidget();
    });
    
    // Add hover effects to the buttons
    const buttons = widget.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('mouseover', () => {
        btn.style.backgroundColor = '#444';
      });
      btn.addEventListener('mouseout', () => {
        btn.style.backgroundColor = '#333';
      });
    });
  }
  
  // Hide the helper widget
  function hideWidget() {
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