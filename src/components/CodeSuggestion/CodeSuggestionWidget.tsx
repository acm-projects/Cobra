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

const CodeSuggestionWidget: React.FC<CodeSuggestionProps> = ({
  selectedText,
  onDismiss,
  position,
  isVisible,
  suggestion
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [displayedSuggestion, setDisplayedSuggestion] = useState<string>("");

  // Get a suggestion based on the selected text
  useEffect(() => {
    if (selectedText && isVisible) {
      if (suggestion) {
        // Use provided suggestion if available
        setDisplayedSuggestion(suggestion);
      } else {
        // Fallback to random suggestion
        const randomIndex = Math.floor(Math.random() * defaultSuggestions.length);
        setDisplayedSuggestion(defaultSuggestions[randomIndex]);
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={widgetRef}
          className="code-suggestion-widget"
          style={{
            top: position.top,
            left: position.left,
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="widget-content">
            <div className="widget-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <div className="widget-suggestion">
              {displayedSuggestion}
            </div>
          </div>
          <div className="widget-actions">
            <button className="action-button apply">
              Apply suggestion
            </button>
            <button className="action-button dismiss" onClick={onDismiss}>
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CodeSuggestionWidget; 