// Background script
console.log('Background script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'INJECT_CONTENT_SCRIPT') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        })
        .then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error: error.message }));
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true; // Required for async response
  }
});

// Handle installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings on installation
    chrome.storage.sync.set({
      voiceEnabled: true,
      autoStart: false,
      language: 'en-US'
    });
  }
});
