// Keep track of media streams
let mediaStream = null;

// Initialize media handling
async function initializeMedia() {
  try {
    // Request setup of media permissions through background script
    chrome.runtime.sendMessage({
      type: 'SETUP_MEDIA_PERMISSIONS'
    });
  } catch (error) {
    console.error('Error initializing media:', error);
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'MEDIA_READY') {
    try {
      // Now we can request media directly since permissions are granted
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });

      // Create video element for camera feed
      const videoElement = document.createElement('video');
      videoElement.srcObject = mediaStream;
      videoElement.autoplay = true;
      videoElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 320px;
        height: 240px;
        border-radius: 8px;
        z-index: 9999;
      `;

      // Add to page
      document.body.appendChild(videoElement);

      // Handle cleanup
      mediaStream.getTracks().forEach(track => {
        track.onended = () => {
          videoElement.remove();
        };
      });

    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }
});

// Start initialization
initializeMedia();

// Cleanup on unload
window.addEventListener('unload', () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }
});
