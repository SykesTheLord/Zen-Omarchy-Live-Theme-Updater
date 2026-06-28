# omarchy-zen-live-theme

Automatically updates your Zen Browser or Firefox colors when you switch omarchy themes — no browser restart needed.

## Which option should I use?

**Option 1 — Script (Zen Browser only):** More accurate color matching, but requires a one-time loader setup. Best if you only use Zen Browser.

**Option 2 — Extension (Firefox & Zen):** Easier to install, works in any Firefox-based browser, and can be installed from the Firefox Add-ons store. Colors may not match as precisely in Zen.

---

## Option 1 — Script

### Step 1: Install the loader (one time only)

The script needs a loader called fx-autoconfig to run inside Zen. Run this once:

```bash
git clone https://github.com/MrOtherGuy/fx-autoconfig.git /tmp/fx-autoconfig
cd /tmp/fx-autoconfig
chmod +x autoconfig-auto.sh
./autoconfig-auto.sh
```

When asked:
- Choose **Install**
- Select **`/opt/zen-browser-bin`** as the browser
- Select your Zen profile (found under `~/.config/zen/`)

Restart Zen Browser to finish.

### Step 2: Install the script

```bash
PROFILE=$(ls ~/.config/zen/ | grep -v profiles.ini | grep -v installs.ini | head -1)
cp omarchy-zen-live-theme.uc.js ~/.config/zen/$PROFILE/chrome/JS/
```

Restart Zen Browser. It will now update automatically on every theme switch.

---

## Option 2 — Extension

### Step 1: Install from the Firefox Add-ons store

Install **omarchy-zen-live-theme** directly from the Firefox Add-ons store — no manual download needed.

### Step 2: Alternatively, install manually

Pack the extension and install it yourself:

```bash
cd extension && zip -r ../omarchy-zen-theme.xpi .
```

In Firefox or Zen: open `about:addons` → click the gear icon → **Install Add-on From File** → select `omarchy-zen-theme.xpi`.

---

## Connecting it to omarchy theme switching

Both options need this step so your browser colors update automatically whenever you run `omarchy theme set`.

### Step 1: Install the helper script

```bash
cp omarchy-theme-set-zen ~/.scripts/omarchy-theme-set-zen
chmod +x ~/.scripts/omarchy-theme-set-zen
```

### Step 2: Create the hook

```bash
mkdir -p ~/.config/omarchy/hooks/theme-set.d
```

Create a file at `~/.config/omarchy/hooks/theme-set.d/zen` with this content:

```bash
#!/bin/bash
~/.scripts/omarchy-theme-set-zen
```

Then make it executable:

```bash
chmod +x ~/.config/omarchy/hooks/theme-set.d/zen
```

### Step 3: Apply your current theme

Run this once to sync your current theme colors to the browser:

```bash
~/.scripts/omarchy-theme-set-zen
```

From here, switching themes with `omarchy theme set <name>` will automatically update your browser colors within a couple of seconds.

---

## Updating

**If you edit the script** — copy it back and restart Zen:
```bash
PROFILE=$(ls ~/.config/zen/ | grep -v profiles.ini | grep -v installs.ini | head -1)
cp omarchy-zen-live-theme.uc.js ~/.config/zen/$PROFILE/chrome/JS/
```

**If you edit the extension** — repack and reinstall:
```bash
cd extension && zip -r ../omarchy-zen-theme.xpi .
```
