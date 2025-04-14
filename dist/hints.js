// Functions for line-by-line hint reveal functionality

/**
 * Prepares a hint card for line-by-line reveal
 * @param {HTMLElement} card - The hint card element
 */
function prepareHintForLineByLine(card) {
  if (!card) return;
  
  // Get content elements
  const textContent = card.querySelector('.hint-content p');
  const codeContent = card.querySelector('.hint-content pre code');
  
  if (textContent && codeContent) {
    // Save original content
    textContent.setAttribute('data-original', textContent.innerHTML);
    codeContent.setAttribute('data-original', codeContent.innerHTML);
    
    // Convert paragraphs to line-by-line format
    const textLines = textContent.textContent.split('. ');
    let textHtml = '';
    textLines.forEach((line, i) => {
      if (line.trim()) {
        textHtml += `<span class="text-line line-blurred" data-line-index="${i+1}">${line.trim()}${i < textLines.length - 1 ? '.' : ''}</span> `;
      }
    });
    textContent.innerHTML = textHtml;
    
    // Convert code to line-by-line format
    const codeLines = codeContent.textContent.split('\n');
    let codeHtml = '';
    codeLines.forEach((line, i) => {
      if (line.trim() || i > 0) { // Include empty lines except the first one
        codeHtml += `<span class="code-line line-blurred" data-line-index="${textLines.length + i + 1}">${line}</span>\n`;
      }
    });
    codeContent.innerHTML = codeHtml;
    
    return textLines.length + codeLines.length;
  }
  
  return 0;
}

/**
 * Creates and adds reveal controls to a hint card
 * @param {HTMLElement} card - The hint card element
 * @param {number} totalLines - Total number of lines to reveal
 */
function addRevealControls(card, totalLines) {
  if (!card || !totalLines) return;
  
  // Create reveal controls container
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'hint-reveal-controls';
  
  // Add reveal next line button
  const revealBtn = document.createElement('button');
  revealBtn.className = 'hint-line-reveal-btn';
  revealBtn.innerHTML = '<i class="fas fa-eye"></i> Reveal Next Line';
  revealBtn.onclick = function() {
    revealNextLine(card);
  };
  
  // Add reveal multiple lines button
  const revealMultiBtn = document.createElement('button');
  revealMultiBtn.className = 'hint-line-reveal-btn';
  revealMultiBtn.innerHTML = '<i class="fas fa-angle-double-down"></i> Reveal 3 Lines';
  revealMultiBtn.onclick = function() {
    revealMultipleLines(card, 3);
  };
  
  controlsDiv.appendChild(revealBtn);
  controlsDiv.appendChild(revealMultiBtn);
  card.appendChild(controlsDiv);
  
  // Add progress indicator
  const progressDiv = document.createElement('div');
  progressDiv.className = 'hint-reveal-progress';
  progressDiv.setAttribute('data-total-lines', totalLines.toString());
  progressDiv.textContent = `0/${totalLines} lines revealed`;
  card.appendChild(progressDiv);
}

/**
 * Reveals the next blurred line in a hint card
 * @param {HTMLElement} card - The hint card element
 */
function revealNextLine(card) {
  if (!card) return;
  
  const lines = card.querySelectorAll('.line-blurred');
  if (lines.length > 0) {
    // Reveal next line
    lines[0].classList.remove('line-blurred');
    
    // Update progress
    updateRevealProgress(card);
    
    // Disable buttons if all lines are revealed
    if (lines.length === 1) {
      const buttons = card.querySelectorAll('.hint-line-reveal-btn');
      buttons.forEach(button => button.classList.add('disabled'));
    }
  }
}

/**
 * Reveals multiple blurred lines in a hint card
 * @param {HTMLElement} card - The hint card element
 * @param {number} count - Number of lines to reveal
 */
function revealMultipleLines(card, count) {
  if (!card) return;
  
  const lines = card.querySelectorAll('.line-blurred');
  const linesToReveal = Math.min(lines.length, count);
  
  // Reveal lines
  for (let i = 0; i < linesToReveal; i++) {
    lines[i].classList.remove('line-blurred');
  }
  
  // Update progress
  updateRevealProgress(card);
  
  // Disable buttons if all lines are revealed
  if (lines.length <= count) {
    const buttons = card.querySelectorAll('.hint-line-reveal-btn');
    buttons.forEach(button => button.classList.add('disabled'));
  }
}

/**
 * Updates the reveal progress indicator
 * @param {HTMLElement} card - The hint card element
 */
function updateRevealProgress(card) {
  if (!card) return;
  
  const progress = card.querySelector('.hint-reveal-progress');
  if (progress) {
    const remaining = card.querySelectorAll('.line-blurred').length;
    const total = parseInt(progress.getAttribute('data-total-lines') || '0');
    progress.textContent = `${total - remaining}/${total} lines revealed`;
  }
}

/**
 * Activates line-by-line hint reveal on a hint card
 * @param {HTMLElement} card - The hint card element
 * @param {HTMLElement} button - The reveal button element to hide
 */
function activateLineByLineReveal(card, button) {
  if (!card) return;
  
  // Prepare the hint content
  const totalLines = prepareHintForLineByLine(card);
  
  // Add reveal controls
  if (totalLines > 0) {
    addRevealControls(card, totalLines);
    
    // Mark card as active
    card.classList.remove('blurred');
    card.classList.add('hint-active');
    
    // Hide the original reveal button
    if (button) {
      button.style.display = 'none';
    }
  }
}

// Initialize hint cards when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Find all hint reveal buttons
  const revealButtons = document.querySelectorAll('.hint-reveal-btn');
  
  // Add click event listeners
  revealButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const card = this.closest('.hint-card');
      if (card && card.classList.contains('blurred')) {
        // Activate line-by-line reveal
        activateLineByLineReveal(card, this);
        e.preventDefault();
      }
    });
  });
}); 