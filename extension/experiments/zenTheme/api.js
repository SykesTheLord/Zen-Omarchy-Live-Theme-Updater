"use strict";

this.zenTheme = class extends ExtensionAPI {
  getAPI(context) {
    return {
      zenTheme: {
        async applyColors({ background, foreground, accent }) {
          const windows = Services.wm.getEnumerator("navigator:browser");
          while (windows.hasMoreElements()) {
            const win = windows.getNext();
            const doc = win.document;

            const bg = doc.getElementById("zen-browser-background");
            const toolbar = doc.getElementById("zen-toolbar-background");
            const root = doc.documentElement;

            if (bg) {
              bg.style.setProperty(
                "--zen-main-browser-background",
                `#${background}`
              );
            }
            if (toolbar) {
              toolbar.style.setProperty(
                "--zen-main-browser-background-toolbar",
                `#${background}`
              );
            }
            if (root) {
              root.style.setProperty("--zen-primary-color", `#${accent}`);
              root.style.setProperty("--toolbox-textcolor", `#${foreground}`);
            }
          }
        },

        async readColorsFile() {
          try {
            const path = PathUtils.join(
              PathUtils.homeDir,
              ".config",
              "omarchy",
              "current",
              "theme",
              "zen-colors.json"
            );
            const stat = await IOUtils.stat(path);
            const raw = await IOUtils.readUTF8(path);
            return { mtime: stat.lastModified, content: raw };
          } catch (e) {
            return null;
          }
        },
      },
    };
  }
};
