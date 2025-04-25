import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CodeSuggestionWidget.css';

interface Position {
  top: number;
  left: number;
}

interface CodeSuggestionProps {
  selectedText: string;
  onDismiss: () => void;
  position: Position;
  isVisible: boolean;
  suggestion?: string;
}

const defaultSuggestions = [
  "Consider simplifying this expression",
  "Check for off-by-one error",
  "Unused variable detected",
  "This could cause a null pointer exception",
  "Consider using a more efficient algorithm",
  "This loop could be optimized",
  "Potential memory leak here",
  "Consider adding a condition to handle edge cases",
];

// Different suggestion types for styling purposes
type SuggestionType = 'warning' | 'improvement' | 'error' | 'info';

const CodeSuggestionWidget: React.FC<CodeSuggestionProps> = ({
  selectedText,
  onDismiss,
  position,
  isVisible,
  suggestion
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [displayedSuggestion, setDisplayedSuggestion] = useState<string>("");
  const [suggestionType, setSuggestionType] = useState<SuggestionType>('improvement');

  // Get a suggestion based on the selected text
  useEffect(() => {
    if (selectedText && isVisible) {
      if (suggestion) {
        // Use provided suggestion if available
        setDisplayedSuggestion(suggestion);
        
        // Determine suggestion type based on content
        if (suggestion.toLowerCase().includes('error') || 
            suggestion.toLowerCase().includes('exception')) {
          setSuggestionType('error');
        } else if (suggestion.toLowerCase().includes('warning') || 
                  suggestion.toLowerCase().includes('check')) {
          setSuggestionType('warning');
        } else if (suggestion.toLowerCase().includes('consider') || 
                  suggestion.toLowerCase().includes('improvement') ||
                  suggestion.toLowerCase().includes('optimize')) {
          setSuggestionType('improvement');
        } else {
          setSuggestionType('info');
        }
      } else {
        // Fallback to random suggestion
        const randomIndex = Math.floor(Math.random() * defaultSuggestions.length);
        const randomSuggestion = defaultSuggestions[randomIndex];
        setDisplayedSuggestion(randomSuggestion);
        
        // Determine suggestion type for random suggestions
        if (randomSuggestion.toLowerCase().includes('error') || 
            randomSuggestion.toLowerCase().includes('exception')) {
          setSuggestionType('error');
        } else if (randomSuggestion.toLowerCase().includes('warning') || 
                  randomSuggestion.toLowerCase().includes('check')) {
          setSuggestionType('warning');
        } else if (randomSuggestion.toLowerCase().includes('consider') || 
                  randomSuggestion.toLowerCase().includes('improvement') ||
                  randomSuggestion.toLowerCase().includes('optimize')) {
          setSuggestionType('improvement');
        } else {
          setSuggestionType('info');
        }
      }
    }
  }, [selectedText, isVisible, suggestion]);

  // Handle click outside to dismiss
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        onDismiss();
      }
    };

    // Handle escape key to dismiss
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onDismiss]);

  if (!isVisible || !selectedText) return null;

  // Helper function to get icon based on suggestion type
  const getIconForType = (type: SuggestionType) => {
    switch (type) {
      case 'error':
        return '⚠️';
      case 'warning':
        return '⚠️';
      case 'improvement':
        return '💡';
      case 'info':
        return 'ℹ️';
      default:
        return '💡';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={widgetRef}
          className={`code-suggestion-widget type-${suggestionType}`}
          style={{
            top: position.top,
            left: position.left,
          }}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.2 
          }}
        >
          <div className="widget-content">
            <div className={`widget-icon type-${suggestionType}`}>
              {getIconForType(suggestionType)}
            </div>
            <div className="widget-suggestion">
              {displayedSuggestion}
            </div>
          </div>
          <div className="widget-actions">
            <button className={`action-button apply type-${suggestionType}`}>
              Fix this issue
            </button>
            <button className="action-button dismiss" onClick={onDismiss}>
              Ignore
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CodeSuggestionWidget; 