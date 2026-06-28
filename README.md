# omarchy-zen-live-theme

A Firefox/Zen Browser WebExtension that watches a JSON file written by a shell script and applies omarchy theme colors to the browser's own chrome UI in real time — no browser restart needed after a theme switch.

## How it works

Zen Browser controls its background and accent colors by calling `element.style.setProperty()` directly on specific DOM elements at startup and on workspace switches. CSS overrides in `userChrome.css` lose to these inline styles on workspace switches. This extension polls a JSON file every 1.5 seconds and re-applies the correct colors directly on those same elements, winning the race.

The shell script (`omarchy-theme-set-zen`) writes `~/.config/omarchy/current/theme/zen-colors.json` whenever a theme is applied. The extension detects the file's mtime changing and re-applies — no polling cost when nothing changes.

## Project layout

```
extension/
├── manifest.json
├── background.js
└── experiments/
    └── zenTheme/
        ├── api.js           # Privileged chrome context: reads file, sets inline styles
        └── schema.json      # Declares applyColors and readColorsFile APIs
omarchy-theme-set-zen        # Shell script: writes userChrome.css + zen-colors.json
```

## Installation

### 1. Install the shell script

Copy `omarchy-theme-set-zen` to `~/.scripts/` and make it executable:

```bash
cp omarchy-theme-set-zen ~/.scripts/omarchy-theme-set-zen
chmod +x ~/.scripts/omarchy-theme-set-zen
```

### 2. Set up the Omarchy hook

Omarchy calls `omarchy-hook theme-set` at the end of every theme switch. Drop a hook script into `~/.config/omarchy/hooks/theme-set.d/` to run the zen script automatically:

```bash
mkdir -p ~/.config/omarchy/hooks/theme-set.d
```

Create `~/.config/omarchy/hooks/theme-set.d/zen`:

```bash
#!/bin/bash
~/.scripts/omarchy-theme-set-zen
```

Make it executable:

```bash
chmod +x ~/.config/omarchy/hooks/theme-set.d/zen
```

From this point on, every `omarchy theme set <name>` call will automatically write `zen-colors.json`, and the running extension will apply the new colors within 1.5 seconds.

### 3. Configure Zen Browser

Add both prefs to every Zen profile's `user.js` (find profiles under `~/.config/zen/`):

```
user_pref("xpinstall.signatures.required", false);
user_pref("extensions.experiments.enabled", true);
```

`xpinstall.signatures.required=false` bypasses Mozilla's signature enforcement.  
`extensions.experiments.enabled=true` unlocks the experiment APIs used by this extension — without it, Zen rejects the install with "not compatible" regardless of version constraints, because experiment APIs are gated to Nightly/Developer Edition by default.

**Restart Zen Browser once** after editing `user.js`.

### 4. Pack and install the extension

```bash
cd extension
zip -r /tmp/omarchy-zen-theme.xpi .
```

In Zen Browser: `about:addons` → gear icon → **Install Add-on From File…** → select `/tmp/omarchy-zen-theme.xpi`

The extension persists across restarts.

### 5. Seed the initial colors file

Run the script once to write the JSON file before the extension has anything to read:

```bash
~/.scripts/omarchy-theme-set-zen
```

## Updating

If you edit extension source files, repack and reinstall:

```bash
cd extension
zip -r /tmp/omarchy-zen-theme.xpi .
# Then: about:addons → gear → Install Add-on From File
```

If you edit `omarchy-theme-set-zen`, copy it back to `~/.scripts/`:

```bash
cp omarchy-theme-set-zen ~/.scripts/omarchy-theme-set-zen
```
