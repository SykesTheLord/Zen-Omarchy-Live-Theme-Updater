"use strict";

const COLORS_URL = "file:///tmp/omarchy-zen-colors.json";

let lastContent = null;

async function checkAndApply() {
  try {
    const resp = await fetch(COLORS_URL, { cache: "no-store" });
    if (!resp.ok) return;

    const text = await resp.text();
    if (text === lastContent) return;
    lastContent = text;

    const colors = JSON.parse(text);
    if (!colors.background || !colors.foreground || !colors.accent) return;

    await browser.theme.update({
      colors: {
        frame:                   `#${colors.background}`,
        toolbar:                 `#${colors.background}`,
        toolbar_text:            `#${colors.foreground}`,
        tab_background_text:     `#${colors.foreground}`,
        tab_selected:            `#${colors.background}`,
        tab_text:                `#${colors.foreground}`,
        tab_line:                `#${colors.accent}`,
        popup:                   `#${colors.background}`,
        popup_text:              `#${colors.foreground}`,
        popup_highlight:         `#${colors.accent}`,
        popup_highlight_text:    `#${colors.foreground}`,
        sidebar:                 `#${colors.background}`,
        sidebar_text:            `#${colors.foreground}`,
        sidebar_highlight:       `#${colors.accent}`,
        sidebar_highlight_text:  `#${colors.foreground}`,
        button_background_hover: `#${colors.accent}`,
        icons:                   `#${colors.foreground}`,
        icons_attention:         `#${colors.accent}`,
      },
    });

    console.log("omarchy-zen-theme: applied theme:", colors.theme ?? "unknown");
  } catch (_) {
    // file absent or unreadable — wait for next tick
  }
}

checkAndApply();
setInterval(checkAndApply, 1500);
