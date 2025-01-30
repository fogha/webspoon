// Keep track of offscreen document
let hasOffscreenDocument = false;

// Create or get the offscreen document
async function setupOffscreenDocument(path) {
  // Check if document already exists
  if (hasOffscreenDocument) {
    return;
  }

  // Create an offscreen document
  await chrome.offscreen.createDocument({
    url: path,
    reasons: ['USER_MEDIA'],
    justification: 'Handle media permissions for extension'
  });

  hasOffscreenDocument = true;
}

// Handle media permission requests
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'SETUP_MEDIA_PERMISSIONS') {
    try {
      // Ensure offscreen document is ready
      await setupOffscreenDocument('offscreen.html');

      // Request media permissions through offscreen document
      chrome.runtime.sendMessage({
        type: 'REQUEST_MEDIA'
      });

      // Send immediate response
      sendResponse({ success: true });
    } catch (error) {
      console.error('Error setting up media permissions:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }

  // Handle media permission responses
  if (message.type === 'MEDIA_PERMISSION_GRANTED') {
    // Notify all content scripts that permissions are granted
    const tabs = await chrome.tabs.query({ active: true });
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'MEDIA_READY'
      });
    });
  }

  if (message.type === 'MEDIA_PERMISSION_ERROR') {
    console.error('Media permission error:', message.error);
  }

  return true;
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason.search(/install/g) === -1) {
      return
  }
  chrome.tabs.create({
      url: chrome.runtime.getURL("offscreen.html"),
      active: true
  })
})

// Clean up offscreen document when extension is updated/reloaded
chrome.runtime.onSuspend.addListener(async () => {
  if (hasOffscreenDocument) {
    await chrome.offscreen.closeDocument();
    hasOffscreenDocument = false;
  }
});
