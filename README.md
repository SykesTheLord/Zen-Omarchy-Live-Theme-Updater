# omarchy-zen-live-theme

Live-applies omarchy theme colors to Zen Browser (and Firefox) chrome UI — no browser restart needed after a theme switch.

## How it works

Zen Browser sets its background and accent colors by calling `element.style.setProperty()` on specific DOM elements at startup and on every workspace switch. `userChrome.css` overrides lose this race on workspace switches. This project provides two approaches to fix that, depending on your use case:

| | `.uc.js` script | Firefox extension |
|---|---|---|
| Targets Zen's exact CSS variables | Yes | Approximate (via theme API) |
| Requires fx-autoconfig loader | Yes | No |
| Publishable on Firefox AMO | No | Yes |
| Works in standard Firefox | No | Yes |

Both read from a JSON file written by `omarchy-theme-set-zen` on every theme switch, and apply changes within 1.5 seconds.

## Project layout

```
omarchy-theme-set-zen          # Shell script: writes userChrome.css + zen-colors.json
omarchy-zen-live-theme.uc.js   # Approach 1: privileged userChrome.js script (Zen-specific)
extension/
├── manifest.json              # Approach 2: standard Firefox add-on (AMO-publishable)
└── background.js
```

---

## Shared setup (both approaches)

### 1. Install the shell script

```bash
cp omarchy-theme-set-zen ~/.scripts/omarchy-theme-set-zen
chmod +x ~/.scripts/omarchy-theme-set-zen
```

### 2. Set up the Omarchy hook

Omarchy calls `omarchy-hook theme-set` at the end of every `omarchy theme set` invocation. This hook runs the zen script automatically on every theme switch:

```bash
mkdir -p ~/.config/omarchy/hooks/theme-set.d
```

Create `~/.config/omarchy/hooks/theme-set.d/zen`:

```bash
#!/bin/bash
~/.scripts/omarchy-theme-set-zen
```

```bash
chmod +x ~/.config/omarchy/hooks/theme-set.d/zen
```

### 3. Seed the initial colors file

```bash
~/.scripts/omarchy-theme-set-zen
```

---

## Approach 1 — `.uc.js` script (recommended for Zen Browser)

Sets Zen's exact inline CSS variables directly. More precise than the extension approach, but requires the fx-autoconfig loader and cannot be distributed on AMO.

### Install fx-autoconfig

```bash
git clone https://github.com/MrOtherGuy/fx-autoconfig.git /tmp/fx-autoconfig
cd /tmp/fx-autoconfig
chmod +x autoconfig-auto.sh
./autoconfig-auto.sh
```

When prompted: choose **Install**, select `/opt/zen-browser-bin` as the browser, and select your active Zen profile (`~/.config/zen/<profile>/`).

Restart Zen and confirm it worked by opening the Browser Console (`Ctrl+Shift+J`) — you should see `USERCHROME.JS TEST - MANAGER WORKING!`.

### Install the script

```bash
PROFILE=$(ls ~/.config/zen/ | grep -v profiles.ini | grep -v installs.ini | head -1)
cp omarchy-zen-live-theme.uc.js ~/.config/zen/$PROFILE/chrome/JS/
```

Restart Zen. The script begins polling immediately.

---

## Approach 2 — Firefox extension (AMO-publishable)

Uses the standard `browser.theme` API to apply colors. Works in both Firefox and Zen Browser, and can be submitted to [addons.mozilla.org](https://addons.mozilla.org). Colors are applied via Firefox's theme system rather than Zen's internal CSS variables, so coverage may differ slightly in Zen.

### Pack the extension

```bash
cd extension
zip -r /tmp/omarchy-zen-theme.xpi .
```

### Install locally

In Firefox or Zen: `about:addons` → gear icon → **Install Add-on From File** → select `/tmp/omarchy-zen-theme.xpi`.

To allow unsigned local installation, add to the profile's `user.js`:

```
user_pref("xpinstall.signatures.required", false);
```

### Submit to AMO

Upload the `.xpi` at [addons.mozilla.org/developers](https://addons.mozilla.org/en-US/developers/). The extension uses only standard `theme` and `file:///tmp/*` permissions and requires no privileged APIs.

---

## Updating

**Script changes** — copy back to `~/.scripts/`, no restart needed:
```bash
cp omarchy-theme-set-zen ~/.scripts/omarchy-theme-set-zen
```

**`.uc.js` changes** — copy to `chrome/JS/` and restart Zen:
```bash
PROFILE=$(ls ~/.config/zen/ | grep -v profiles.ini | grep -v installs.ini | head -1)
cp omarchy-zen-live-theme.uc.js ~/.config/zen/$PROFILE/chrome/JS/
```

**Extension changes** — repack and reinstall:
```bash
cd extension && zip -r /tmp/omarchy-zen-theme.xpi .
```
