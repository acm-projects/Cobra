import React, { useEffect, useState } from 'react';
import CodeSuggestionWidget from './CodeSuggestionWidget';
import { isCodeSnippet, getSuggestion } from '../../services/codeAnalysis';

interface Position {
  top: number;
  left: number;
}

// Using an enum to define the selectable elements
enum SelectableElement {
  CodeEditor = 'div.monaco-editor',
  LeetcodeCodeArea = 'div.CodeMirror',
  AnyPre = 'pre',
}

const SelectionDetector: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [widgetPosition, setWidgetPosition] = useState<Position>({ top: 0, left: 0 });
  const [isWidgetVisible, setIsWidgetVisible] = useState<boolean>(false);
  const [selectionTimeout, setSelectionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [suggestion, setSuggestion] = useState<string>('');

  // Function to check if the selection is within a code editor
  const isSelectionInCodeEditor = (selection: Selection): boolean => {
    if (!selection || selection.isCollapsed) return false;

    // Get the common ancestor of the selection
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    
    // Check if the selection is within any of our target elements
    for (const selector of Object.values(SelectableElement)) {
      if (container.nodeType === Node.ELEMENT_NODE && 
          (container as Element).closest(selector)) {
        return true;
      }
      
      if (container.nodeType === Node.TEXT_NODE && 
          container.parentElement && 
          container.parentElement.closest(selector)) {
        return true;
      }
    }
    
    return false;
  };

  // Function to get the position for the widget
  const getWidgetPosition = (selection: Selection): Position => {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Calculate position of the widget, placing it above and centered over the selection
    // with some offset to not cover the selection
    return {
      top: window.scrollY + rect.top - 60, // 50px above the selection
      left: window.scrollX + rect.left + (rect.width / 2) - 150, // Centered (widget width is 300px)
    };
  };

  // Handle text selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      // Clear any existing timeout
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
        setSelectionTimeout(null);
      }
      
      // Check if there's a valid selection within a code editor
      if (selection && !selection.isCollapsed && isSelectionInCodeEditor(selection)) {
        const text = selection.toString().trim();
        
        // Only proceed if we have meaningful text (e.g., not just whitespace)
        if (text.length > 0 && isCodeSnippet(text)) {
          // Set a small delay before showing the widget to avoid it appearing for very brief selections
          const timeout = setTimeout(() => {
            // Get suggestion for the selected code
            const codeSuggestion = getSuggestion(text);
            
            setSelectedText(text);
            setSuggestion(codeSuggestion);
            setWidgetPosition(getWidgetPosition(selection));
            setIsWidgetVisible(true);
          }, 300);
          
          setSelectionTimeout(timeout);
        } else {
          setIsWidgetVisible(false);
        }
      } else {
        // No valid selection, but don't hide widget immediately 
        // (user might be interacting with the widget itself)
      }
    };
    
    // Handle mouseup to check selection (sometimes selectionchange doesn't fire as expected)
    const handleMouseUp = () => {
      // Small delay to ensure selection is complete
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed && isSelectionInCodeEditor(selection)) {
          const text = selection.toString().trim();
          if (text.length > 0 && isCodeSnippet(text)) {
            // Get suggestion for the selected code
            const codeSuggestion = getSuggestion(text);
            
            setSelectedText(text);
            setSuggestion(codeSuggestion);
            setWidgetPosition(getWidgetPosition(selection));
            setIsWidgetVisible(true);
          }
        }
      }, 100);
    };

    // Attach event listeners
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleMouseUp);
      if (selectionTimeout) clearTimeout(selectionTimeout);
    };
  }, [selectionTimeout]);

  // Handle widget dismissal
  const handleDismissWidget = () => {
    setIsWidgetVisible(false);
  };

  return (
    <CodeSuggestionWidget
      selectedText={selectedText}
      onDismiss={handleDismissWidget}
      position={widgetPosition}
      isVisible={isWidgetVisible}
      suggestion={suggestion}
    />
  );
};

export default SelectionDetector; 