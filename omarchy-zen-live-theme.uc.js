// ==UserScript==
// @name           omarchy-zen-live-theme
// @description    Live-applies omarchy theme colors to Zen Browser chrome
// ==/UserScript==
"use strict";

let lastMtime = null;

async function checkAndApply() {
  try {
    const path = PathUtils.join(
      PathUtils.homeDir,
      ".config", "omarchy", "current", "theme", "zen-colors.json"
    );

    const stat = await IOUtils.stat(path);
    if (stat.lastModified === lastMtime) return;
    lastMtime = stat.lastModified;

    const colors = JSON.parse(await IOUtils.readUTF8(path));
    if (!colors.background || !colors.foreground || !colors.accent) return;

    const windows = Services.wm.getEnumerator("navigator:browser");
    while (windows.hasMoreElements()) {
      const win = windows.getNext();
      const doc = win.document;

      const bg      = doc.getElementById("zen-browser-background");
      const toolbar = doc.getElementById("zen-toolbar-background");
      const root    = doc.documentElement;

      if (bg)      bg.style.setProperty("--zen-main-browser-background",         `#${colors.background}`);
      if (toolbar) toolbar.style.setProperty("--zen-main-browser-background-toolbar", `#${colors.background}`);
      if (root) {
        root.style.setProperty("--zen-primary-color",  `#${colors.accent}`);
        root.style.setProperty("--toolbox-textcolor",  `#${colors.foreground}`);
      }
    }

    console.log("omarchy-zen-live-theme: applied theme:", colors.theme ?? "unknown");
  } catch (_) {
    // file absent or unreadable — silently wait for next tick
  }
}

checkAndApply();
setInterval(checkAndApply, 1500);
