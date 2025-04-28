#!/bin/bash

# Build script for Cobra extension with LeetCode Analyzer fixes
echo "🔨 Building Cobra extension with LeetCode Analyzer fixes..."

# Create a temp directory for the build
mkdir -p temp-build-dir
echo "📁 Created temporary build directory"

# Copy all necessary files to the build directory
echo "📝 Copying extension files..."
cp -r manifest.json images styles.css temp-build-dir/
cp content.js background.js signin.html sidepanel.html temp-build-dir/ 2>/dev/null || echo "⚠️ Some files not found, but that's expected"
cp leetcodeUserVerification.js contentGrabCodeDraft.js leetCodeSelectionWidget.js injectScript.js leetCodeEditorButton.js temp-build-dir/ 2>/dev/null || echo "⚠️ Some LeetCode files not found, but that's expected"
cp injectMonacoAccess.js temp-build-dir/ 2>/dev/null || echo "⚠️ Monaco access file not found, but that's expected"

# Copy our modified analyzer files
echo "📝 Copying modified LeetCode Analyzer files..."
cp leetcode-analyzer.js leetcode-analyzer-inject.js leetcode-analyzer.css temp-build-dir/

# Create the ZIP file
echo "🗜️ Creating ZIP package..."
cd temp-build-dir
zip -r ../cobra-with-fixed-analyzer.zip *
cd ..

echo "✅ Build completed successfully!"
echo "📦 Output file: cobra-with-fixed-analyzer.zip"
echo ""
echo "To install the extension:"
echo "1. Go to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top-right)"
echo "3. If you have an existing version, remove it first"
echo "4. Drag and drop the cobra-with-fixed-analyzer.zip file onto the extensions page"
echo "   OR click 'Load unpacked' and select the temp-build-dir folder"
echo ""
echo "Note: After loading the extension, you may need to refresh any open LeetCode tabs" 