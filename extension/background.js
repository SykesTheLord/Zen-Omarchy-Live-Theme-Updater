"use strict";

let lastMtime = null;

async function checkAndApply() {
  const result = await browser.zenTheme.readColorsFile();
  if (!result) return;

  if (result.mtime === lastMtime) return;
  lastMtime = result.mtime;

  let colors;
  try {
    colors = JSON.parse(result.content);
  } catch (e) {
    console.error("omarchy-zen-theme: failed to parse colors file", e);
    return;
  }

  if (!colors.background || !colors.foreground || !colors.accent) return;

  await browser.zenTheme.applyColors({
    background: colors.background,
    foreground: colors.foreground,
    accent: colors.accent,
  });

  console.log("omarchy-zen-theme: applied theme:", colors.theme ?? "unknown");
}

checkAndApply();
setInterval(checkAndApply, 1500);
