# omarchy-zen-live-theme

Applies omarchy theme colors to Zen Browser's chrome UI in real time — no browser restart needed after a theme switch.

## How it works

Zen Browser sets its background and accent colors by calling `element.style.setProperty()` directly on specific DOM elements at startup and on every workspace switch. This means `userChrome.css` overrides lose on workspace switches.

`omarchy-zen-live-theme.uc.js` is a privileged userChrome.js script that polls `~/.config/omarchy/current/theme/zen-colors.json` every 1.5 seconds. When the file's mtime changes (i.e. after a theme switch), it re-applies the correct inline styles on those same elements — overwriting Zen's values within 1.5 seconds. It uses `IOUtils` and `Services` directly, requiring no extension system and no signing.

The shell script (`omarchy-theme-set-zen`) writes that JSON file, along with the existing `userChrome.css` fallback, whenever a theme is applied.

## Project layout

```
omarchy-zen-live-theme.uc.js   # The userChrome.js polling script
omarchy-theme-set-zen          # Shell script: writes userChrome.css + zen-colors.json
```

## Installation

### 1. Install fx-autoconfig (one time)

fx-autoconfig is the loader that enables `.uc.js` scripts to run in the privileged browser context. It requires two files in Zen's app directory and a few files in your profile's `chrome/` folder.

Clone and run the automated installer:

```bash
git clone https://github.com/MrOtherGuy/fx-autoconfig.git /tmp/fx-autoconfig
cd /tmp/fx-autoconfig
chmod +x autoconfig-auto.sh
./autoconfig-auto.sh
```

When prompted:
- Choose **Install**
- Select **`/opt/zen-browser-bin`** as the browser installation
- Select your active Zen profile (under `~/.config/zen/`)

After it completes, restart Zen. Open the Browser Console (`Ctrl+Shift+J`) and confirm you see `USERCHROME.JS TEST - MANAGER WORKING!`.

> If the installer can't find your profile automatically, the profile directory is `~/.config/zen/<profile-dir>/`.

### 2. Install the script

Copy `omarchy-zen-live-theme.uc.js` to the `JS/` folder fx-autoconfig created in your profile's `chrome/` directory:

```bash
PROFILE=$(ls ~/.config/zen/ | grep -v profiles.ini | grep -v installs.ini | head -1)
cp omarchy-zen-live-theme.uc.js ~/.config/zen/$PROFILE/chrome/JS/
```

Restart Zen. The script starts polling immediately.

### 3. Install the shell script

```bash
cp omarchy-theme-set-zen ~/.scripts/omarchy-theme-set-zen
chmod +x ~/.scripts/omarchy-theme-set-zen
```

### 4. Set up the Omarchy hook

Omarchy calls `omarchy-hook theme-set` at the end of every `omarchy theme set` invocation. Drop a hook script into `~/.config/omarchy/hooks/theme-set.d/` to wire the zen script into every theme switch automatically:

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

### 5. Seed the initial colors file

Run the script once to write `zen-colors.json` before the userChrome script has anything to read:

```bash
~/.scripts/omarchy-theme-set-zen
```

The running script picks it up within 1.5 seconds.

## Updating

If you edit `omarchy-zen-live-theme.uc.js`, copy it back to the `chrome/JS/` directory and restart Zen:

```bash
PROFILE=$(ls ~/.config/zen/ | grep -v profiles.ini | grep -v installs.ini | head -1)
cp omarchy-zen-live-theme.uc.js ~/.config/zen/$PROFILE/chrome/JS/
```

If you edit `omarchy-theme-set-zen`, copy it back to `~/.scripts/` — no restart needed.

## Why not a browser extension?

The WebExtension `experiment_apis` manifest field required to access `IOUtils` and `Services` is reserved for Mozilla-privileged extensions. It cannot be published on AMO and is blocked in Zen Browser's release builds (`extensions.experiments.enabled` is false by default and restricted to Nightly/Developer Edition). The `.uc.js` approach gives equivalent access with no signing or publishing requirements.
