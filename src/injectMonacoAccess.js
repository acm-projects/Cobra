// Script to inject into the page to access Monaco editor API
console.log('COBRA: Monaco access script injected');

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
    // Try to find the model in the DOM
    for (const element of monacoElements) {
      // Check if this element has the editor instance in its __proto__
      if (element && element.__proto__ && element.__proto__.editor) {
        console.log('COBRA: Monaco editor found via DOM element');
        return element.__proto__.editor;
      }
    }
  }
  
  console.log('COBRA: Monaco editor not found');
  return null;
};

// Signal to our content script that we're ready
window.dispatchEvent(new CustomEvent('cobra-monaco-injected')); 