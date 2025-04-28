// Code Analysis Module
// This module handles analyzing code for errors, performance issues, and other problems

// Define error types
const ErrorType = {
  ERROR: 'error',
  WARNING: 'warning',
  PERFORMANCE: 'performance',
  SUGGESTION: 'suggestion'
};

// Simple text-based patterns to identify common coding issues
const COMMON_PATTERNS = [
  {
    pattern: /while\s*\([^;]*\)\s*\{\s*[^;]*\}/,
    message: 'Potential infinite loop detected. Ensure the loop condition will eventually be false.',
    type: ErrorType.ERROR,
    fix: 'Make sure you increment your counter variable inside the loop.'
  },
  {
    pattern: /for\s*\([^;]*;\s*[^;]*;\s*\)\s*\{/,
    message: 'Missing loop increment in for loop, which may cause an infinite loop.',
    type: ErrorType.ERROR,
    fix: 'Add an increment statement in the third part of the for loop, e.g., for(i=0; i<10; i++)'
  },
  {
    pattern: /if\s*\([^=]*=[^=][^)]*\)/,
    message: 'Assignment (=) used in conditional instead of comparison (== or ===).',
    type: ErrorType.ERROR,
    fix: 'Change = to === for strict equality comparison or == for loose equality.'
  },
  {
    pattern: /==/,
    message: 'Using loose equality (==) which may lead to unexpected type coercion.',
    type: ErrorType.WARNING,
    fix: 'Consider using strict equality (===) to avoid type coercion issues.'
  },
  {
    pattern: /Array\.sort\(\)/,
    message: 'Array.sort() without a compare function sorts elements as strings by default.',
    type: ErrorType.WARNING,
    fix: 'Provide a compare function, e.g., Array.sort((a, b) => a - b) for numeric sorting.'
  },
  {
    pattern: /\w+\.\w+\s*===?\s*undefined/,
    message: 'Potential TypeError if the parent object is undefined.',
    type: ErrorType.WARNING,
    fix: 'Use optional chaining operator (?.) or check if the parent exists first.'
  },
  {
    pattern: /O\(n\^2\)/i,
    message: 'Quadratic time complexity detected. This may be inefficient for large inputs.',
    type: ErrorType.PERFORMANCE,
    fix: 'Consider a more efficient algorithm or data structure.'
  },
  {
    pattern: /\.indexOf\([^)]*\)\s*!=?=?\s*-1/,
    message: 'Using indexOf for existence check is less readable than includes() and can be slower.',
    type: ErrorType.PERFORMANCE,
    fix: 'Consider using Array.includes() or Set.has() for more efficient lookups.'
  },
  {
    pattern: /for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)\s*\{\s*[^{]*\.push/,
    message: 'Building an array with repeated .push() in a loop can be inefficient.',
    type: ErrorType.PERFORMANCE,
    fix: 'Consider using Array.map() or defining array with a known size.'
  },
  {
    pattern: /console\.log/,
    message: 'Debug console.log statements should be removed from production code.',
    type: ErrorType.SUGGESTION,
    fix: 'Remove console.log statements before submission.'
  }
];

// Advanced analysis for specific data structures and algorithms
const ALGORITHM_PATTERNS = {
  binarySearch: {
    pattern: /while\s*\([^;]*\)\s*\{\s*[^;]*mid[^;]*\(/,
    improvements: [
      'Check for integer overflow when calculating midpoint. Use mid = left + Math.floor((right - left) / 2) instead of (left + right) / 2',
      'Ensure you handle the case when the target is not found',
      'Make sure your loop converges by updating left or right appropriately'
    ],
    type: ErrorType.PERFORMANCE
  },
  twoPointers: {
    pattern: /\w+\s*=\s*0[^;]*;\s*\w+\s*=\s*\w+\.length\s*-\s*1/,
    improvements: [
      'When using two pointers, ensure that the pointers eventually meet or cross',
      'Check edge cases like empty arrays or arrays with a single element'
    ],
    type: ErrorType.SUGGESTION
  },
  dynamicProgramming: {
    pattern: /\w+\s*=\s*new\s*Array\([^;]*\);[^;]*\w+\[0\]\s*=/,
    improvements: [
      'Initialize your DP array with appropriate base cases',
      'Ensure your recurrence relation is correct',
      'Consider optimizing space complexity by using rolling arrays when possible'
    ],
    type: ErrorType.PERFORMANCE
  }
};

// Analyze the provided code and return an array of issues
export function analyzeCode(code) {
  if (!code || typeof code !== 'string' || code.trim() === '') {
    return [{ 
      message: 'No code to analyze', 
      type: ErrorType.WARNING,
      lineNumber: 0
    }];
  }
  
  const issues = [];
  const lines = code.split('\n');
  
  // Check for common patterns
  COMMON_PATTERNS.forEach(pattern => {
    const matches = code.match(pattern.pattern);
    if (matches) {
      // Find line number for the match
      let lineNumber = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(pattern.pattern)) {
          lineNumber = i + 1;
          break;
        }
      }
      
      issues.push({
        message: pattern.message,
        type: pattern.type,
        fix: pattern.fix,
        lineNumber,
        codeSnippet: matches[0]
      });
    }
  });
  
  // Check for algorithm-specific patterns
  Object.entries(ALGORITHM_PATTERNS).forEach(([name, { pattern, improvements, type }]) => {
    const matches = code.match(pattern);
    if (matches) {
      // Find line number for the match
      let lineNumber = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(pattern)) {
          lineNumber = i + 1;
          break;
        }
      }
      
      issues.push({
        message: `Detected possible ${name} algorithm. Consider these improvements:`,
        type,
        fix: improvements.join('\n'),
        lineNumber,
        codeSnippet: matches[0]
      });
    }
  });
  
  // Add complexity analysis (simple estimation)
  const complexity = estimateComplexity(code);
  if (complexity) {
    issues.push({
      message: `Estimated time complexity: ${complexity.time}`,
      type: ErrorType.PERFORMANCE,
      fix: complexity.suggestions.join('\n'),
      lineNumber: 0
    });
  }
  
  return issues;
}

// Very simple estimation of code complexity
function estimateComplexity(code) {
  let complexity = { time: 'O(n)', suggestions: [] };
  
  // Check for nested loops - O(n²)
  if (/for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)[^{]*\{[^}]*for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)/.test(code)) {
    complexity.time = 'O(n²)';
    complexity.suggestions.push('Your code contains nested loops which result in quadratic time complexity. Consider if this is necessary or if there are more efficient approaches.');
  }
  
  // Check for recursive calls without memoization
  if (/function\s+\w+[^{]*\{[^}]*\1\s*\([^)]*\)/.test(code) && !code.includes('memo')) {
    complexity.suggestions.push('Your code appears to be recursive without memoization. Consider adding memoization to avoid redundant calculations.');
  }
  
  // Check for potentially optimizable operations
  if (code.includes('.indexOf') || code.includes('.includes')) {
    complexity.suggestions.push('Consider using a Set or Map for faster lookups instead of array methods like indexOf or includes for large datasets.');
  }
  
  return complexity;
}

// Function to format analysis results as HTML
export function formatAnalysisResults(issues) {
  if (!issues || issues.length === 0) {
    return '<div style="padding: 10px; text-align: center;">No issues found. Great job!</div>';
  }
  
  const groupedIssues = {
    [ErrorType.ERROR]: [],
    [ErrorType.WARNING]: [],
    [ErrorType.PERFORMANCE]: [],
    [ErrorType.SUGGESTION]: []
  };
  
  // Group issues by type
  issues.forEach(issue => {
    if (groupedIssues[issue.type]) {
      groupedIssues[issue.type].push(issue);
    } else {
      groupedIssues[ErrorType.SUGGESTION].push(issue);
    }
  });
  
  let html = '';
  
  // Add error count summary
  const totalIssues = issues.length;
  const errorCount = groupedIssues[ErrorType.ERROR].length;
  const warningCount = groupedIssues[ErrorType.WARNING].length;
  const perfCount = groupedIssues[ErrorType.PERFORMANCE].length;
  
  html += `<div style="margin-bottom: 10px; font-size: 13px;">Found ${totalIssues} issue${totalIssues !== 1 ? 's' : ''}`;
  if (errorCount > 0) html += `, including ${errorCount} error${errorCount !== 1 ? 's' : ''}`;
  html += '</div>';
  
  // Add issues by type
  for (const [type, typeIssues] of Object.entries(groupedIssues)) {
    if (typeIssues.length === 0) continue;
    
    let typeName;
    let typeColor;
    
    switch(type) {
      case ErrorType.ERROR:
        typeName = 'Errors';
        typeColor = '#f44336';
        break;
      case ErrorType.WARNING:
        typeName = 'Warnings';
        typeColor = '#ffc107';
        break;
      case ErrorType.PERFORMANCE:
        typeName = 'Performance Issues';
        typeColor = '#2196f3';
        break;
      case ErrorType.SUGGESTION:
        typeName = 'Suggestions';
        typeColor = '#4caf50';
        break;
      default:
        typeName = 'Other Issues';
        typeColor = '#9e9e9e';
    }
    
    html += `<div style="margin-top: 12px;">
      <div style="font-weight: 500; font-size: 14px; color: ${typeColor}; margin-bottom: 8px;">${typeName}</div>`;
      
    typeIssues.forEach(issue => {
      let bgColor;
      let borderColor;
      
      switch(type) {
        case ErrorType.ERROR:
          bgColor = 'rgba(255, 0, 0, 0.1)';
          borderColor = '#f44336';
          break;
        case ErrorType.WARNING:
          bgColor = 'rgba(255, 255, 0, 0.05)';
          borderColor = '#ffc107';
          break;
        case ErrorType.PERFORMANCE:
          bgColor = 'rgba(0, 0, 255, 0.05)';
          borderColor = '#2196f3';
          break;
        case ErrorType.SUGGESTION:
          bgColor = 'rgba(0, 255, 0, 0.05)';
          borderColor = '#4caf50';
          break;
        default:
          bgColor = 'rgba(100, 100, 100, 0.05)';
          borderColor = '#9e9e9e';
      }
      
      html += `<div class="error-item" style="background: ${bgColor}; border-left: 3px solid ${borderColor}; padding: 8px; margin-bottom: 8px; border-radius: 0 4px 4px 0;">
        <div style="font-weight: 500; font-size: 13px; margin-bottom: 4px;">${issue.message}</div>`;
        
      if (issue.lineNumber > 0) {
        html += `<div style="font-size: 12px; color: #ddd;">Line ${issue.lineNumber}</div>`;
      }
        
      if (issue.codeSnippet) {
        html += `<pre style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; font-size: 12px; overflow-x: auto; margin: 6px 0;">${escapeHtml(issue.codeSnippet)}</pre>`;
      }
        
      if (issue.fix) {
        html += `<div style="font-size: 12px; color: #aaa; margin-top: 4px;">Suggestion: ${issue.fix}</div>`;
      }
        
      html += `</div>`;
    });
      
    html += `</div>`;
  }
  
  return html;
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
} 