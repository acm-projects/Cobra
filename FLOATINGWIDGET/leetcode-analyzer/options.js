document.addEventListener('DOMContentLoaded', () => {
    // Load saved API key
    chrome.storage.sync.get('openaiApiKey', (data) => {
        if (data.openaiApiKey) {
            document.getElementById('openai-key').value = data.openaiApiKey;
        }
    });

    // Save API key
    document.getElementById('save').addEventListener('click', () => {
        const openaiApiKey = document.getElementById('openai-key').value.trim();
        
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