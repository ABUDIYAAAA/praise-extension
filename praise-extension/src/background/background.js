chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// when user clicks the toolbar icon, open the sidepanel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});
