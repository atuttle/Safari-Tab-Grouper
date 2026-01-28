# Safari Tab Grouper Extension

A Safari Web Extension that groups tabs by domain and limits duplicate tabs.

> ["i need a safari extension that will group tabs from the same domain together and stop me from opening 3 duplicate tabs ……………… anyone??"](https://bsky.app/profile/amyhoy.bsky.social/post/3mdj6azcshk27)

I don't have an Apple Developer account and I'm not going to pay for it to publish an extension I don't use, but I mean, here's the code. If anyone wants to compile it and publish it, you have my blessing.

## License

This project is dedicated to the public domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

## Features

- **Auto-grouping**: Tabs sorted by domain on open/navigate
- **Duplicate blocking**: Closes dupes, switches to existing tab

## Installation

Requires: macOS, Xcode 12+, Safari 14+, free Apple ID.

### 1. Convert Extension

```bash
xcrun safari-web-extension-converter ./extension --project-location ./SafariTabGroup --app-name "Tab Grouper"
open ./SafariTabGroup/Tab\ Grouper.xcodeproj
```

### 2. Configure Signing

1. Xcode > Settings > Accounts — add Apple ID
2. Select project > each target > Signing & Capabilities
3. Enable "Automatically manage signing", select Personal Team

### 3. Build

Press ⌘R.

### 4. Allow Unsigned Extensions

Safari > Settings > Advanced > "Show features for web developers"
Develop > Allow Unsigned Extensions (resets each Safari session)

### 5. Enable Extension

Safari > Settings > Extensions > enable "Tab Grouper" > "Allow for Every Website"

> [!NOTE]
> I think you could write an Automator script to make these setting changes every time you open Safari.

## Permissions

- **tabs**: Query, move, close tabs
- **storage**: Settings
- **host_permissions**: URL access

## Troubleshooting

**Extension missing?** Check Safari Settings > Extensions. Rebuild if needed.

**Tabs not grouping?** Grant all-websites permission. Special Safari pages can't move.

**Duplicates not blocked?** Exact URL match only.
