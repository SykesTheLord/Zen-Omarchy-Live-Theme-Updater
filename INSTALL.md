# omarchy-zen-live-theme — Installation

## What it does

A Firefox/Zen Browser WebExtension that polls `~/.config/omarchy/current/theme/zen-colors.json`
every 1.5 seconds and applies theme colors directly to Zen Browser's chrome elements in real
time — no browser restart needed after a theme switch.

## Files created

| Path | Purpose |
|------|---------|
| `~/.local/share/omarchy-zen-theme/` | Extension source |
| `~/.scripts/omarchy-theme-set-zen` | Updated to write `zen-colors.json` |
| `/tmp/omarchy-zen-theme.xpi` | Packed extension ready to install |

## One-time setup

### 1. Allow unsigned + experimental extensions

Add both prefs to every Zen profile's `user.js` (e.g. `~/.config/zen/<profile>/user.js`):

```
user_pref("xpinstall.signatures.required", false);
user_pref("extensions.experiments.enabled", true);
```

`xpinstall.signatures.required=false` bypasses signature enforcement.
`extensions.experiments.enabled=true` unlocks experiment APIs — without this, Zen blocks
the extension with "not compatible" even after removing all version constraints,
because experiment_apis are restricted to Nightly/Dev Edition by default.

Then **restart Zen Browser once**.

### 2. Install the extension

In Zen Browser:
- Open `about:addons`
- Click the gear icon → **Install Add-on From File…**
- Select `/tmp/omarchy-zen-theme.xpi`

The extension persists across restarts.

### 3. Write the initial colors file

Run the theme script once to seed the JSON file:

```bash
~/.scripts/omarchy-theme-set-zen
```

The extension will pick up the file within 1.5 seconds and apply colors immediately —
no restart needed.

## Ongoing use

Every time `omarchy-theme-set-zen` runs (e.g. triggered by omarchy's theme switcher),
it writes an updated `zen-colors.json`. The running extension detects the file change
via mtime and re-applies the new colors automatically, within 1.5 seconds.

## Repacking after edits

If you edit the extension source under `~/.local/share/omarchy-zen-theme/`:

```bash
cd ~/.local/share/omarchy-zen-theme
zip -r /tmp/omarchy-zen-theme.xpi .
```

Then reinstall the `.xpi` via `about:addons`.
