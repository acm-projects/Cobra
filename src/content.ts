// Define the message interface
interface HintMessage {
  type: 'showHint';
  hint: string;
}

// Create the overlay for displaying hints
const overlay = document.createElement('div');
overlay.id = 'cobra-overlay';
overlay.innerHTML = `
  <div class="cobra-hints" style="
    position: fixed;
    top: 20px;
    right: 20px;
    background:rgb(152, 155, 226);
    color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: 'Segoe UI', Arial, sans-serif;
    display: none;
  ">
    <h3 style="margin: 0 0 10px 0;">Cobra Hints</h3>
    <div id="cobra-hints-content">Loading hints...</div>
  </div>
`;

document.body.appendChild(overlay);

/**
 * Show a hint in the overlay
 * @param hint - The hint text to display
 */
const showHint = (hint: string): void => {
  const hintElement = document.querySelector('#cobra-hints-content');
  const hintContainer = document.querySelector('.cobra-hints');
  
  if (hintElement && hintContainer) {
    hintElement.textContent = hint;
    (hintContainer as HTMLElement).style.display = 'block';
    
    // Hide the hint after 10 seconds
    setTimeout(() => {
      (hintContainer as HTMLElement).style.display = 'none';
    }, 10000);
  }
};

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request: HintMessage, sender, sendResponse) => {
  if (request.type === 'showHint') {
    // Display the hint in the overlay
    showHint(request.hint);
    console.log('Received hint:', request.hint);
  }
  return true;
}); 