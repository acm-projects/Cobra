function detectProblem() {
    const platform = window.location.hostname;
    let problemTitle = '';
  
    if (platform.includes('leetcode.com')) {
      problemTitle = document.querySelector('[data-cy="question-title"]')?.innerText;
    } else if (platform.includes('hackerrank.com')) {
      problemTitle = document.querySelector('.challenge-title')?.innerText;
    } else if (platform.includes('codeforces.com')) {
      problemTitle = document.querySelector('.title')?.innerText;
    }
  
    if (problemTitle) {
      chrome.runtime.sendMessage({ 
        type: 'detectPlatform', 
        platform, 
        problemTitle 
      });
    }
  }
  
  detectProblem();
  
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