import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { SelectionDetector } from './index';

const CodeSuggestionRoot: React.FC = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create container for the suggestion UI
    const rootContainer = document.createElement('div');
    rootContainer.id = 'cobra-code-suggestion-root';
    rootContainer.style.position = 'absolute';
    rootContainer.style.top = '0';
    rootContainer.style.left = '0';
    rootContainer.style.width = '0';
    rootContainer.style.height = '0';
    rootContainer.style.overflow = 'visible';
    rootContainer.style.pointerEvents = 'none';
    rootContainer.style.zIndex = '10000';
    
    // Add container to the document
    document.body.appendChild(rootContainer);
    setContainer(rootContainer);
    
    // Clean up on unmount
    return () => {
      document.body.removeChild(rootContainer);
    };
  }, []);

  // Return null if the container doesn't exist yet
  if (!container) return null;
  
  // Use a portal to render the SelectionDetector into the container
  return ReactDOM.createPortal(
    <SelectionDetector />,
    container
  );
};

export default CodeSuggestionRoot; 