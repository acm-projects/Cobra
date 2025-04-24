// Simple content script to verify that the extension is running
console.log("COBRA EXTENSION LOADED");

// Check if we're on LeetCode
const isLeetCodePage = window.location.hostname.includes('leetcode.com');
console.log(`Is LeetCode page: ${isLeetCodePage}`);

// Create a visible indicator
function createVisibleIndicator() {
  // Create floating button with app style
  const button = document.createElement('button');
  button.innerText = isLeetCodePage ? 'COBRA' : 'COBRA';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '9999999';
  button.style.backgroundColor = '#4d5bce';
  button.style.color = 'white';
  button.style.padding = '10px 15px';
  button.style.borderRadius = '8px';
  button.style.border = '1px solid rgba(77, 91, 206, 0.2)';
  button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
  button.style.fontWeight = 'bold';
  button.style.cursor = 'pointer';
  button.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
  button.style.fontSize = '14px';
  button.style.transition = 'all 0.2s ease';
  
  // Add hover effect
  button.addEventListener('mouseover', () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
  });
  
  button.addEventListener('mouseout', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
  });
  
  // Add click handler
  button.addEventListener('click', () => {
    if (isLeetCodePage) {
      // Create a code test UI in the app's style
      const codeTest = document.createElement('div');
      codeTest.innerHTML = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #1a1b26;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          z-index: 9999999;
          width: 450px;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          border: 1px solid rgba(77, 91, 206, 0.2);
          backdrop-filter: blur(8px);
          color: #e3e3e3;
        ">
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 16px;
          ">
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 8px;
              background-color: rgba(77, 91, 206, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 12px;
              color: #4d5bce;
            ">
              <div style="font-size: 18px;">⚡</div>
            </div>
            <h3 style="
              margin: 0;
              color: #e3e3e3;
              font-size: 18px;
              font-weight: 600;
            ">Code Suggestion Test</h3>
            <button id="cobra-test-dismiss" style="
              background: none;
              border: none;
              color: #8a8eac;
              margin-left: auto;
              cursor: pointer;
              font-size: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              border-radius: 8px;
              transition: all 0.2s ease;
            ">✕</button>
          </div>
          
          <div style="
            background: rgba(30, 31, 44, 0.7);
            padding: 16px;
            border-radius: 8px;
            font-family: 'Fira Code', monospace;
            margin-bottom: 16px;
            border: 1px solid rgba(77, 91, 206, 0.1);
            line-height: 1.5;
            font-size: 14px;
            color: #e3e3e3;
            position: relative;
          ">
            <div style="position: absolute; top: 8px; right: 8px; font-family: 'Inter', sans-serif; font-size: 12px; color: #8a8eac;">JavaScript</div>
            <pre style="margin: 0; overflow-x: auto; padding-top: 12px;"><code>function calculateTotal(items) {
  let total = 0;
  
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  
  return total;
}</code></pre>
          </div>
          
          <p style="
            color: #8a8eac;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 20px;
          ">Try selecting the code above. When you select code in LeetCode, Cobra will analyze it and suggest improvements.</p>
          
          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <button id="cobra-test-cancel" style="
              padding: 8px 16px;
              background: rgba(77, 91, 206, 0.1);
              color: #8a8eac;
              border: 1px solid rgba(77, 91, 206, 0.2);
              border-radius: 8px;
              cursor: pointer;
              font-family: 'Inter', sans-serif;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.2s ease;
            ">Cancel</button>
            
            <button id="cobra-test-ok" style="
              padding: 8px 16px;
              background: #4d5bce;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-family: 'Inter', sans-serif;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.2s ease;
              box-shadow: 0 4px 12px rgba(77, 91, 206, 0.25);
            ">Got it</button>
          </div>
          
          <div style="
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid rgba(77, 91, 206, 0.1);
            font-size: 12px;
            color: #8a8eac;
            text-align: center;
          ">
            Cobra will help you write better code with real-time suggestions.
          </div>
        </div>
      `;
      
      document.body.appendChild(codeTest);
      
      // Add dismiss and cancel handlers
      const dismissButton = codeTest.querySelector('#cobra-test-dismiss');
      const cancelButton = codeTest.querySelector('#cobra-test-cancel');
      const okButton = codeTest.querySelector('#cobra-test-ok');
      
      if (dismissButton) {
        dismissButton.addEventListener('click', () => {
          codeTest.remove();
        });
      }
      
      if (cancelButton) {
        cancelButton.addEventListener('click', () => {
          codeTest.remove();
        });
      }
      
      if (okButton) {
        okButton.addEventListener('click', () => {
          codeTest.remove();
          // Create a test suggestion widget
          showTestSuggestion();
        });
      }
      
      // Add selection listener for test
      document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
          console.log(`Selection detected: ${selection.toString().trim()}`);
        }
      });
    } else {
      alert('Cobra extension is active!');
    }
  });
  
  // Add to page
  document.body.appendChild(button);
  console.log("COBRA indicator button added to page");
}

// Show a test suggestion when requested
function showTestSuggestion() {
  // Create test widget
  const widget = document.createElement('div');
  widget.style.position = 'fixed';
  widget.style.top = '130px';
  widget.style.left = '50%';
  widget.style.transform = 'translateX(-50%)';
  widget.style.zIndex = '9999999';
  widget.style.width = '350px';
  widget.style.backgroundColor = '#1a1b26';
  widget.style.borderRadius = '12px';
  widget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
  widget.style.overflow = 'hidden';
  widget.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
  widget.style.border = '1px solid rgba(77, 91, 206, 0.2)';
  widget.style.animation = 'fadeInDown 0.3s ease';
  
  widget.innerHTML = `
    <style>
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translate(-50%, -10px);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }
    </style>
    <div style="
      display: flex;
      padding: 16px;
      align-items: flex-start;
      gap: 12px;
      border-bottom: 1px solid rgba(77, 91, 206, 0.1);
    ">
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: rgba(77, 91, 206, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4d5bce;
        flex-shrink: 0;
      ">
        <div style="font-size: 16px;">💡</div>
      </div>
      <div style="
        font-size: 14px;
        color: #e3e3e3;
        flex: 1;
        line-height: 1.5;
      ">
        Consider using <code style="background: rgba(77, 91, 206, 0.1); padding: 2px 4px; border-radius: 4px; color: #4d5bce;">reduce()</code> for a more functional approach to calculating the total.
      </div>
    </div>
    
    <div style="
      display: flex;
      padding: 12px 16px;
      gap: 12px;
      background-color: rgba(30, 31, 44, 0.6);
    ">
      <button id="cobra-dismiss-suggestion" style="
        padding: 8px 12px;
        background: transparent;
        color: #8a8eac;
        border: 1px solid rgba(77, 91, 206, 0.2);
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s ease;
        flex: 1;
      ">Dismiss</button>
      
      <button style="
        padding: 8px 12px;
        background: #4d5bce;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(77, 91, 206, 0.2);
        flex: 1.5;
      ">Apply suggestion</button>
    </div>
  `;
  
  document.body.appendChild(widget);
  
  // Add dismiss handler
  const dismissButton = widget.querySelector('#cobra-dismiss-suggestion');
  if (dismissButton) {
    dismissButton.addEventListener('click', () => {
      widget.remove();
    });
  }
}

// Run when the page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createVisibleIndicator);
} else {
  createVisibleIndicator();
} 