# LeetCode Helper Button Extension

This Chrome extension adds a helpful floating button to LeetCode's code editor, similar to Grammarly. When clicked, it presents a popup widget with various code-related actions.

## Features

- **Contextual Button**: Appears when you click in the code editor area
- **Helper Widget**: Shows options for checking, optimizing, explaining code, and viewing documentation
- **Non-intrusive**: Only appears when you interact with the code editor

## Installation Instructions

### Method 1: Install as Chrome Extension (Recommended)

1. Download this repository or clone it to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the extension directory (the main folder containing manifest.json)
5. The extension should now be installed and active

### Method 2: Manual Script Injection (For testing)

If you don't want to install the full extension, you can test the functionality by opening the browser console on LeetCode and pasting the contents of `leetCodeEditorButton.js`.

## Usage

1. Go to any LeetCode problem page (e.g., https://leetcode.com/problems/two-sum/)
2. Click anywhere in the code editor
3. The small green helper button will appear near your cursor
4. Click the button to open the helper widget
5. Select one of the available actions

## Troubleshooting

If the button doesn't appear:

1. Check the console for any error messages (F12 to open developer tools)
2. Make sure you're on a LeetCode problem page with a Monaco editor
3. Try refreshing the page
4. Verify the extension is enabled in Chrome's extensions page

## Development

If you want to modify the extension:

1. The main functionality is in `src/leetCodeEditorButton.js`
2. After making changes, you'll need to reload the extension in `chrome://extensions/`
3. Click the refresh icon on the extension card

## Permissions

This extension requires the following permissions:
- Access to LeetCode.com pages
- Ability to inject scripts into web pages

## Privacy

This extension does not collect any data. It only operates on LeetCode.com and doesn't send any information to external servers. 