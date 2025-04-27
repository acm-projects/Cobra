#!/bin/bash

# Development script for quick updating of LeetCode Analyzer files
echo "🔄 Updating LeetCode Analyzer files in dist directory..."

# Copy the latest versions of the analyzer files to dist
cp leetcode-analyzer.js leetcode-analyzer-inject.js dist/
cp leetcode-analyzer.css dist/

echo "✅ Files updated successfully!"
echo ""

# Try to run Chrome extension reloader if flag is passed
if [ "$1" == "--reload" ]; then
  # This part only works on MacOS with Chrome installed in the standard location
  if [ -f "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
    echo "🔄 Attempting to reload extensions in Chrome..."
    # This AppleScript will try to refresh the extension page
    osascript -e '
      tell application "Google Chrome"
        set extensionsURL to "chrome://extensions/"
        set found to false
        
        # Look for an extensions tab
        repeat with w in windows
          repeat with t in tabs of w
            if URL of t starts with extensionsURL then
              set found to true
              tell t to reload
              tell application "System Events" to keystroke "r" using {command down}
              exit repeat
            end if
          end repeat
          if found then exit repeat
        end repeat
        
        # If no extensions tab was found, create one
        if not found then
          tell window 1
            set newTab to make new tab with properties {URL:extensionsURL}
          end tell
        end if
        
        # Activate Chrome
        activate
      end tell
    '
    echo "✅ Chrome extensions page refreshed"
  else
    echo "❌ Chrome not found in standard location"
  fi
fi

echo ""
echo "Next steps:"
echo "1. Go to chrome://extensions/"
echo "2. Find the Cobra extension"
echo "3. Click the refresh/reload button (circular arrow)"
echo "4. Navigate to LeetCode to test your changes"
echo ""
echo "To create a new ZIP package, run:"
echo "cp leetcode-analyzer.js leetcode-analyzer-inject.js manifest.json dist/ && cd dist && zip -r ../cobra-latest.zip *"
echo ""
echo "Pro tip: Run with --reload flag to attempt automatic Chrome extension reload:"
echo "./dev-update.sh --reload" 