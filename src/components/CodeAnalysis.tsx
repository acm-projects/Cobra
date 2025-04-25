import React, { useState, useEffect } from 'react';

interface CodeSelection {
  text: string;
  url: string;
  timestamp: number;
}

const CodeAnalysis: React.FC = () => {
  const [codeSelection, setCodeSelection] = useState<CodeSelection>({
    text: '',
    url: '',
    timestamp: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Function to generate suggestions based on the code snippet
  const generateSuggestions = (code: string): string[] => {
    // Simple suggestions based on code patterns
    const generatedSuggestions: string[] = [];
    
    if (code.includes('for (') || code.includes('while (')) {
      generatedSuggestions.push("Check your loop conditions. Off-by-one errors are common in loop boundaries.");
    }
    
    if (code.includes('if (') && !code.includes('else')) {
      generatedSuggestions.push("Consider adding an else clause to handle the negative case.");
    }
    
    if (code.includes('==')) {
      generatedSuggestions.push("Consider using === for strict equality comparison in JavaScript.");
    }
    
    if (code.length > 100) {
      generatedSuggestions.push("This code block is getting complex. Consider refactoring into smaller functions.");
    }
    
    if (code.includes('.length') && code.includes('for (')) {
      generatedSuggestions.push("Consider caching the length property outside the loop for better performance.");
    }
    
    // Add general suggestions
    generatedSuggestions.push(
      "Consider the time complexity of your solution.",
      "Check edge cases like empty input or boundary values.",
      "Make sure you're handling all potential error cases."
    );
    
    return generatedSuggestions;
  };

  // Function to fetch the latest selection from the background script
  const fetchLatestSelection = () => {
    chrome.runtime.sendMessage({ action: "getLatestSelection" }, (response) => {
      if (response && response.text && response.timestamp !== codeSelection.timestamp) {
        setCodeSelection(response);
        setLoading(true);
        
        // Generate suggestions for the code
        setTimeout(() => {
          setSuggestions(generateSuggestions(response.text));
          setLoading(false);
        }, 500); // Simulate analysis time
      }
    });
  };

  // Listen for updates from the background script
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.action === "updateSidePanel" && message.selection) {
        setCodeSelection(message.selection);
        setLoading(true);
        
        // Generate suggestions for the code
        setTimeout(() => {
          setSuggestions(generateSuggestions(message.selection.text));
          setLoading(false);
        }, 500); // Simulate analysis time
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    
    // Initial fetch of latest selection
    fetchLatestSelection();
    
    // Poll for updates every 2 seconds
    const intervalId = setInterval(fetchLatestSelection, 2000);
    
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
      clearInterval(intervalId);
    };
  }, []);

  // If no code has been selected yet
  if (!codeSelection.text) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Code Analysis</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
          <p>Select some code on LeetCode to analyze it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Code Analysis</h3>
      
      {/* Selected code display */}
      <div className="mb-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-auto max-h-40">
          <pre className="text-xs whitespace-pre-wrap font-mono">
            {codeSelection.text}
          </pre>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Selected from {new URL(codeSelection.url).hostname}
        </div>
      </div>
      
      {/* Suggestions */}
      <div>
        <h4 className="font-semibold mb-2">Suggestions</h4>
        
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm">
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CodeAnalysis; 