interface CodeAnalysisResult {
  suggestion: string;
  type: 'warning' | 'error' | 'improvement' | 'info';
  confidence: number; // 0-1 value representing confidence level
}

/**
 * Simple rules for code analysis
 * In a production environment, this would be more comprehensive
 */
const rules = [
  {
    pattern: /i\s*\+\+\s*</,
    suggestion: "Check for potential off-by-one error with increment",
    type: "warning" as const,
    confidence: 0.7
  },
  {
    pattern: /i\s*\-\-\s*</,
    suggestion: "Check for potential off-by-one error with decrement",
    type: "warning" as const,
    confidence: 0.7
  },
  {
    pattern: /(\w+)\s*=\s*new\s+\w+.*(?!\1\s*=\s*null)/,
    suggestion: "Potential memory leak - object created but never cleaned up",
    type: "warning" as const,
    confidence: 0.6
  },
  {
    pattern: /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*(\w+)\.length\s*;/,
    suggestion: "Consider caching the length property outside the loop for better performance",
    type: "improvement" as const,
    confidence: 0.8
  },
  {
    pattern: /\.push\([^)]*\)\s*.*\.push\(/,
    suggestion: "Multiple array pushes could be combined for better readability",
    type: "improvement" as const,
    confidence: 0.5
  },
  {
    pattern: /if\s*\(\s*(\w+)\s*!==?\s*null\s*\)\s*{\s*\1\./,
    suggestion: "Consider using optional chaining (?.) for null checks",
    type: "improvement" as const,
    confidence: 0.9
  },
  {
    pattern: /console\.log/,
    suggestion: "Remember to remove console.log statements before submission",
    type: "info" as const,
    confidence: 0.95
  },
  {
    pattern: /=[^=]=+/,
    suggestion: "Check equality operator - did you mean === instead of ==?",
    type: "error" as const,
    confidence: 0.8
  },
  {
    pattern: /const\s+(\w+)[^=]*=[^;]*;\s*\1\s*=/,
    suggestion: "Reassigning a constant variable will cause an error",
    type: "error" as const,
    confidence: 0.9
  },
  {
    pattern: /if\s*\([^{]*\)\s*\w+[^{;](?!\s*[{;])/,
    suggestion: "Missing curly braces in if statement - consider adding them for clarity",
    type: "warning" as const,
    confidence: 0.7
  },
  {
    pattern: /(\w+)\s*=\s*(\w+)/,
    suggestion: "Check variable assignment - is this the correct variable?",
    type: "info" as const,
    confidence: 0.3
  },
  {
    pattern: /(\w+)\s*\+\+\s*;\s*return\s+\1/,
    suggestion: "Incrementing after the return won't affect the returned value",
    type: "error" as const,
    confidence: 0.85
  }
];

/**
 * Analyzes a code snippet and returns suggestions.
 */
export function analyzeCode(code: string): CodeAnalysisResult | null {
  // Simple code analysis logic
  for (const rule of rules) {
    if (rule.pattern.test(code)) {
      return {
        suggestion: rule.suggestion,
        type: rule.type,
        confidence: rule.confidence
      };
    }
  }

  // No matching rule found
  return null;
}

/**
 * Determines if the code snippet is worth analyzing.
 * This helps filter out small selections that might not be code.
 */
export function isCodeSnippet(text: string): boolean {
  // Trim the text and check if it has enough content to be code
  const trimmed = text.trim();
  
  // Check if it's too short
  if (trimmed.length < 3) return false;
  
  // Check if it contains any programming-like characters
  const codeCharacters = /[(){}\[\];=+\-*/%<>!&|^~?:]/;
  
  return codeCharacters.test(trimmed);
}

/**
 * Gets context-specific suggestions based on the code.
 */
export function getSuggestion(code: string): string {
  // Try to analyze the code
  const analysis = analyzeCode(code);
  
  // If we have a high-confidence suggestion, use it
  if (analysis && analysis.confidence > 0.6) {
    return analysis.suggestion;
  }
  
  // Fallback suggestions for when we can't analyze the code
  const fallbackSuggestions = [
    "Review this code for edge cases",
    "Consider optimizing this section for better performance",
    "Check for potential null or undefined values",
    "This could be simplified for better readability",
    "Ensure this logic handles all possible scenarios"
  ];
  
  // Return a random fallback suggestion
  const randomIndex = Math.floor(Math.random() * fallbackSuggestions.length);
  return fallbackSuggestions[randomIndex];
} 