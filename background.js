chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Conditions to check if the tab is suitable for script injection
  if (
    tab.url?.startsWith("chrome://") ||
    !tab.url ||
    (changeInfo.status === "complete" && /^http/.test(tab.url))
  ) {
    // Execute script injection
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: injectScript,
      },
      () => {
        console.log("Script injected");
      },
    );
  }
});

function injectScript() {
  // Check if the script has been injected before
  chrome.storage.local.get("injected", ({ injected }) => {
    if (!injected) {
      // Inject CSS file
      chrome.scripting
        .insertCSS({
          target: { tabId: chrome.devtools.inspectedWindow.tabId },
          files: ["./styles.css"],
        })
        .then(() => {
          console.log("CSS injected");
        })
        .catch((err) => {
          console.error(err, "Error injecting CSS");
        });

      // Execute main script file
      chrome.scripting
        .executeScript({
          target: { tabId: chrome.devtools.inspectedWindow.tabId },
          files: ["./content.js"],
        })
        .then(() => {
          console.log("Script injected");
          // Mark script as injected
          chrome.storage.local.set({ injected: true });
        })
        .catch((err) => {
          console.error(err, "Error injecting script");
        });
    }
  });
}
