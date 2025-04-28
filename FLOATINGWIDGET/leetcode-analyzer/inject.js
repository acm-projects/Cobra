console.log('[LeetCode Analyzer] Injected script loaded');

// Flag to track if Monaco hooks are initialized
let monacoHooksInitialized = false;

// Function to find the Monaco editor instance
function getMonacoEditor() {
    console.log('[LeetCode Analyzer] Trying to get Monaco editor...');
    
    // First try to get it from monaco models
    try {
        if (window.monaco && window.monaco.editor) {
            const models = window.monaco.editor.getModels();
            if (models && models.length > 0) {
                console.log('[LeetCode Analyzer] Found Monaco editor from models');
                return models[0];
            }
            
            // If no models, try to get from editors list
            const editors = window.monaco.editor.getEditors();
            if (editors && editors.length > 0) {
                console.log('[LeetCode Analyzer] Found Monaco editor from editors list');
                return editors[0].getModel();
            }
        }
    } catch (error) {
        console.error('[LeetCode Analyzer] Error while trying to get Monaco editor:', error);
    }
    
    console.log('[LeetCode Analyzer] Monaco editor not found yet');
    return null;
}

// Function to wait for Monaco to be available and set up the hooks
function waitForMonaco(maxAttempts = 30, interval = 1000) {
    console.log('[LeetCode Analyzer] Waiting for Monaco editor to be available...');
    
    let attempts = 0;
    const checkInterval = setInterval(() => {
        attempts++;
        console.log(`[LeetCode Analyzer] Checking for Monaco editor (attempt ${attempts}/${maxAttempts})...`);
        
        const editor = getMonacoEditor();
        
        if (editor) {
            clearInterval(checkInterval);
            console.log('[LeetCode Analyzer] Monaco editor found, setting up content change listener');
            
            // Set up content change listener
            editor.onDidChangeContent(debounceAnalysis(editor));
            
            // Mark hooks as initialized
            monacoHooksInitialized = true;
            
            // Trigger initial analysis if there's already code
            const currentValue = editor.getValue();
            if (currentValue && currentValue.trim().length > 0) {
                console.log('[LeetCode Analyzer] Found existing code, triggering initial analysis');
                setTimeout(() => {
                    dispatchEditorChangeEvent(editor);
                }, 1000);
            }
            
            console.log('[LeetCode Analyzer] Monaco hooks initialized successfully');
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.error('[LeetCode Analyzer] Failed to find Monaco editor after maximum attempts');
        }
    }, interval);
}

// Debounced function to avoid too many analysis requests
function debounceAnalysis(editor) {
    let timer = null;
    
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
        
        timer = setTimeout(() => {
            dispatchEditorChangeEvent(editor);
        }, 2000); // Reduced from 5000ms to 2000ms for a more responsive experience
    };
}

// Function to get the problem slug from the URL
function getProblemSlug() {
    const match = window.location.pathname.match(/\/problems\/([^/]+)/);
    return match ? match[1] : null;
}

// Function to dispatch the editor change event
function dispatchEditorChangeEvent(editor) {
    if (!editor) return;
    
    const code = editor.getValue();
    const problemSlug = getProblemSlug();
    
    if (!code || !problemSlug) {
        console.log('[LeetCode Analyzer] Missing code or problem slug, not dispatching event');
        return;
    }
    
    console.log('[LeetCode Analyzer] Dispatching editor change event');
    
    // Create and dispatch a custom event with the editor content and problem slug
    const event = new CustomEvent('leetCodeEditorChanged', {
        detail: {
            code: code,
            problemSlug: problemSlug
        }
    });
    
    window.dispatchEvent(event);
}

// Initialize the script
function initialize() {
    console.log('[LeetCode Analyzer] Injected script initializing');
    
    // Check if we're on a LeetCode problem page
    if (!window.location.pathname.includes('/problems/')) {
        console.log('[LeetCode Analyzer] Not on a problem page, exiting');
        return;
    }
    
    // Wait for Monaco to be available
    waitForMonaco();
    
    // Also listen for page navigation events to re-initialize if needed
    window.addEventListener('popstate', () => {
        console.log('[LeetCode Analyzer] Navigation detected, checking if re-initialization is needed');
        
        // Check if we're on a problem page
        if (window.location.pathname.includes('/problems/') && !monacoHooksInitialized) {
            console.log('[LeetCode Analyzer] On a new problem page, re-initializing');
            waitForMonaco();
        }
    });
}

// Start the script
initialize();
