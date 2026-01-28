# Safari Tab Grouper Extension

A Safari Web Extension that groups tabs by domain and limits duplicate tabs.

> ["i need a safari extension that will group tabs from the same domain together and stop me from opening 3 duplicate tabs ……………… anyone??"](https://bsky.app/profile/amyhoy.bsky.social/post/3mdj6azcshk27)

I don't have an Apple Developer account and I'm not going to pay for it to publish an extension I don't use, but I mean, here's the code. If anyone wants to compile it and publish it, you have my blessing.

## Features

- **Auto-Group Tabs by Domain**: Automatically sorts tabs by domain (hostname) whenever a tab is opened or navigates
- **Duplicate Prevention**: Automatically closes duplicate tabs (same exact URL) and switches to the existing tab

## Installation (Personal Use - No Paid Developer Account Required)

### Prerequisites

- macOS with Xcode installed (version 12.0 or later)
- Safari 14 or later
- A free Apple ID (no paid Apple Developer Program membership needed)

### Step 1: Convert to Safari Extension

Open Terminal, navigate to this project directory, and run the converter:

```bash
cd /path/to/safari-tab-group

# Convert the extension to an Xcode project
xcrun safari-web-extension-converter ./extension --project-location ./SafariTabGroup --app-name "Tab Grouper"

# Open the generated Xcode project
open ./SafariTabGroup/Tab\ Grouper.xcodeproj
```

### Step 2: Configure Signing in Xcode

1. In Xcode, go to **Xcode > Settings** (or Preferences) **> Accounts**
2. Click the **+** button and sign in with your Apple ID
3. In the project navigator (left sidebar), click on **"Tab Grouper"** (the top-level project)
4. Select the **"Tab Grouper"** target, then the **Signing & Capabilities** tab
5. Check **"Automatically manage signing"**
6. For **Team**, select your **"Personal Team"** (your name with "(Personal Team)" next to it)
7. Repeat for the **"Tab Grouper Extension"** target

### Step 3: Build and Run

1. Press **⌘R** (or Product > Run) to build and run the app
2. The Tab Grouper app will open — you can close it, it just needs to be built once

### Step 4: Enable Unsigned Extensions in Safari

1. Open Safari
2. Go to **Safari > Settings > Advanced**
3. Check **"Show features for web developers"** (or "Show Develop menu in menu bar")
4. Close Settings, then go to **Develop > Allow Unsigned Extensions**
5. Enter your password when prompted

> **Note:** The "Allow Unsigned Extensions" setting resets every time Safari quits. You'll need to re-enable it each session. A paid Apple Developer account ($99/year) is only needed if you want to avoid this or distribute the extension to others.

### Step 5: Enable the Extension

1. Go to **Safari > Settings > Extensions**
2. Check the box next to **"Tab Grouper"**
3. Click **"Allow for Every Website"** when prompted (required for the extension to access tab URLs)

## Usage

### Automatic Tab Grouping

Tabs are automatically sorted by domain whenever you:

- Open a new tab
- Navigate to a new URL

You can also manually trigger a re-sort by clicking the extension icon and pressing "Re-sort Tabs Now".

### Automatic Duplicate Prevention

The extension automatically monitors for duplicate tabs:

- When you open a duplicate tab with the same exact URL, it will be closed
- Safari will switch to one of the existing tabs with that URL
- A notification appears in the popup if a duplicate was recently blocked

## Project Structure

```
safari-tab-group/
├── extension/
│   ├── manifest.json      # Extension configuration (Manifest V3)
│   ├── background.js      # Core logic for tab management
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Popup interactions
│   ├── popup.css          # Popup styling (with dark mode)
│   └── icons/             # Extension icons
└── README.md              # This file
```

## Permissions

The extension requires the following permissions:

- **tabs**: To query, move, and close tabs
- **storage**: To store settings and status information
- **host_permissions (<all_urls>)**: To access tab URLs for domain extraction

## Technical Notes

- Built with Manifest V3 for Safari compatibility
- Uses `browser.tabs.move()` for tab sorting (Safari doesn't have native tab grouping API)
- Service worker-based background script

## Troubleshooting

### Extension not appearing in Safari

1. Make sure the extension is enabled in Safari Settings > Extensions
2. Check that you've granted the necessary permissions
3. Try rebuilding the Xcode project

### Tabs not grouping

1. Ensure the extension has permission to access all websites
2. Some special Safari pages (like Settings) cannot be moved

### Duplicates not being blocked

1. The extension only blocks exact URL matches (including query parameters)
2. Check that the extension is enabled and has permissions

## License

This project is dedicated to the public domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
