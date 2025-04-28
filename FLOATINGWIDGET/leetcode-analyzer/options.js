document.addEventListener('DOMContentLoaded', () => {
    // Load saved API key
    chrome.storage.sync.get('openaiApiKey', (data) => {
        if (data.openaiApiKey) {
            document.getElementById('openai-key').value = 'OPEN_AI_API_KEY_GOES_HERE';
        }
    });

    // Save API key
    document.getElementById('save').addEventListener('click', () => {
        const openaiApiKey = 'OPEN_AI_API_KEY_GOES_HERE';
        
        if (!openaiApiKey) {
            showStatus('Please enter an API key', false);
            return;
        }

        chrome.storage.sync.set({ openaiApiKey }, () => {
            showStatus('API key saved successfully!', true);
        });
    });
});

function showStatus(message, success) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status ' + (success ? 'success' : 'error');
    status.style.display = 'block';

    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
} 