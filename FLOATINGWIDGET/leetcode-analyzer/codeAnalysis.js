// Function to analyze code using OpenAI
export const analyzeCodeWithOpenAI = async (code, problemSlug) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a code analysis assistant. Analyze the provided code for potential errors, inefficiencies, and best practices. Return specific line numbers and suggestions."
          },
          {
            role: "user",
            content: `Analyze this code for the LeetCode problem ${problemSlug}:\n\n${code}`
          }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing code with OpenAI:', error);
    return null;
  }
};

// Function to create and display floating UI
export const displayAnalysisResults = (analysis, codeElement) => {
  // Remove any existing analysis UI
  const existingUI = document.querySelector('.leetcode-analyzer-ui');
  if (existingUI) {
    existingUI.remove();
  }

  // Create floating UI container
  const uiContainer = document.createElement('div');
  uiContainer.className = 'leetcode-analyzer-ui';
  uiContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 15px;
    max-width: 400px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
  `;

  // Add analysis content
  const content = document.createElement('div');
  content.innerHTML = analysis;
  uiContainer.appendChild(content);

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  `;
  closeButton.onclick = () => uiContainer.remove();
  uiContainer.appendChild(closeButton);

  // Add to document
  document.body.appendChild(uiContainer);
};

// Function to highlight code lines
export const highlightCodeLines = (lineNumbers, codeElement) => {
  // Remove existing highlights
  const existingHighlights = codeElement.querySelectorAll('.leetcode-analyzer-highlight');
  existingHighlights.forEach(el => el.classList.remove('leetcode-analyzer-highlight'));

  // Add new highlights
  lineNumbers.forEach(lineNumber => {
    const line = codeElement.querySelector(`[data-line-number="${lineNumber}"]`);
    if (line) {
      line.classList.add('leetcode-analyzer-highlight');
    }
  });
}; 