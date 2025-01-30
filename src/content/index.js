// Content script for DOM manipulation
console.log('WebSpoon content script loaded');

import SelectionService from '../services/selectionService.js';

let selectionService = null;

// Initialize selection service
const initializeSelectionService = () => {
  if (!selectionService) {
    selectionService = new SelectionService();
  }
};

// DOM manipulation functions
const domActions = {
  navigate: (url) => {
    if (url.startsWith('http') || url.startsWith('https')) {
      window.location.href = url;
    } else {
      window.location.href = `https://${url}`;
    }
    return { success: true, message: `Navigating to ${url}` };
  },

  scroll: (direction, amount = 500) => {
    const scrollAmount = direction === 'up' ? -amount : amount;
    window.scrollBy({
      top: scrollAmount,
      behavior: 'smooth'
    });
    return { success: true, message: `Scrolled ${direction}` };
  },

  click: (text) => {
    const elements = Array.from(document.querySelectorAll('a, button, [role="button"], input[type="submit"], input[type="button"]'))
      .filter(el => {
        const content = (el.textContent || el.value || '').toLowerCase();
        return content.includes(text.toLowerCase());
      });

    if (elements.length > 0) {
      elements[0].click();
      return { success: true, message: `Clicked element containing "${text}"` };
    }
    return { success: false, message: `No clickable element found containing "${text}"` };
  },

  goBack: () => {
    window.history.back();
    return { success: true, message: 'Going back' };
  },

  goForward: () => {
    window.history.forward();
    return { success: true, message: 'Going forward' };
  },

  refresh: () => {
    window.location.reload();
    return { success: true, message: 'Refreshing page' };
  },

  search: (text) => {
    const searchInput = document.querySelector('input[type="search"], input[name="q"], input[name="search"]');
    if (searchInput) {
      searchInput.value = text;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      return { success: true, message: `Searching for "${text}"` };
    }
    return { success: false, message: 'No search input found' };
  },

  focus: (elementText) => {
    const elements = Array.from(document.querySelectorAll('input, textarea, [contenteditable="true"]'))
      .filter(el => {
        const placeholder = el.placeholder || '';
        const label = el.labels?.[0]?.textContent || '';
        return (placeholder + label).toLowerCase().includes(elementText.toLowerCase());
      });

    if (elements.length > 0) {
      elements[0].focus();
      return { success: true, message: `Focused on "${elementText}"` };
    }
    return { success: false, message: `No input found matching "${elementText}"` };
  },

  type: (text) => {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
      activeElement.value = text;
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      return { success: true, message: `Typed "${text}"` };
    }
    return { success: false, message: 'No input element focused' };
  },

  press: (key) => {
    const keyMap = {
      'enter': 'Enter',
      'escape': 'Escape',
      'tab': 'Tab',
      'space': ' ',
      'backspace': 'Backspace'
    };
    
    const mappedKey = keyMap[key.toLowerCase()] || key;
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: mappedKey, bubbles: true }));
    return { success: true, message: `Pressed ${key} key` };
  },

  zoom: (direction) => {
    const zoomLevel = direction === 'in' ? 1.1 : 0.9;
    document.body.style.zoom = (parseFloat(document.body.style.zoom || 1) * zoomLevel).toString();
    return { success: true, message: `Zoomed ${direction}` };
  },

  select: (text) => {
    const options = Array.from(document.querySelectorAll('select option, [role="option"]'))
      .filter(el => el.textContent.toLowerCase().includes(text.toLowerCase()));
    
    if (options.length > 0) {
      options[0].selected = true;
      options[0].closest('select')?.dispatchEvent(new Event('change', { bubbles: true }));
      return { success: true, message: `Selected "${text}"` };
    }
    return { success: false, message: `No option found containing "${text}"` };
  },

  copy: (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent;
      navigator.clipboard.writeText(text);
      return { success: true, message: `Copied text: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"` };
    }
    return { success: false, message: `No element found matching "${selector}"` };
  },

  scrollTo: (elementText) => {
    const elements = Array.from(document.querySelectorAll('*'))
      .filter(el => el.textContent.toLowerCase().includes(elementText.toLowerCase()));
    
    if (elements.length > 0) {
      elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return { success: true, message: `Scrolled to "${elementText}"` };
    }
    return { success: false, message: `No element found containing "${elementText}"` };
  },

  openLink: (text) => {
    const links = Array.from(document.getElementsByTagName('a'))
      .filter(link => link.textContent.toLowerCase().includes(text.toLowerCase()));
    
    if (links.length > 0) {
      window.open(links[0].href, '_blank');
      return { success: true, message: `Opened "${text}" in new tab` };
    }
    return { success: false, message: `No link found containing "${text}"` };
  },

  closeTab: () => {
    window.close();
    return { success: true, message: 'Closing tab' };
  },

  maximize: () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      return { success: true, message: 'Maximized window' };
    }
    return { success: false, message: 'Could not maximize window' };
  },

  minimize: () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return { success: true, message: 'Minimized window' };
    }
    return { success: false, message: 'Could not minimize window' };
  },

  mute: (action = 'mute') => {
    const mediaElements = document.querySelectorAll('video, audio');
    if (mediaElements.length > 0) {
      mediaElements.forEach(media => {
        media.muted = action === 'mute';
      });
      return { success: true, message: `${action === 'mute' ? 'Muted' : 'Unmuted'} media` };
    }
    return { success: false, message: 'No media elements found' };
  },

  playMedia: (action = 'play') => {
    const mediaElements = document.querySelectorAll('video, audio');
    if (mediaElements.length > 0) {
      mediaElements.forEach(media => {
        action === 'play' ? media.play() : media.pause();
      });
      return { success: true, message: `${action === 'play' ? 'Playing' : 'Paused'} media` };
    }
    return { success: false, message: 'No media elements found' };
  }
};

// Initialize message listener
function initMessageListener() {
  // Remove any existing listeners
  chrome.runtime.onMessage.removeListener(handleMessage);
  
  // Add new listener
  chrome.runtime.onMessage.addListener(handleMessage);
  
  // Send ready message
  chrome.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY' });
}

// Message handler
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  try {
    initializeSelectionService();

    switch (request.action) {
      case 'SUMMARIZE_SELECTION': {
        const selection = selectionService.getCurrentSelection();
        if (!selection || !selection.text) {
          throw new Error('No text selected');
        }

        // Send text to background script for OpenAI processing
        const summary = await new Promise((resolve) => {
          chrome.runtime.sendMessage({
            action: 'PROCESS_WITH_AI',
            type: 'summary',
            text: selection.text
          }, resolve);
        });

        // Save summary if requested
        if (request.save) {
          await selectionService.saveToDocument(summary, 'md');
        }

        sendResponse({ message: 'Text summarized', summary });
        break;
      }

      case 'SCREENSHOT_SELECTION': {
        const screenshot = await selectionService.takeScreenshot();
        
        // Convert data URL to blob and save
        const response = await fetch(screenshot);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `webspoon-screenshot-${new Date().toISOString()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        sendResponse({ message: 'Screenshot saved' });
        break;
      }

      case 'SAVE_SELECTION': {
        const selection = selectionService.getCurrentSelection();
        if (!selection || !selection.text) {
          throw new Error('No text selected');
        }

        await selectionService.saveToDocument(selection.text);
        sendResponse({ message: 'Selection saved to document' });
        break;
      }

      case 'TRANSLATE_SELECTION': {
        const selection = selectionService.getCurrentSelection();
        if (!selection || !selection.text) {
          throw new Error('No text selected');
        }

        const targetLanguage = request.params[0] || 'english';
        
        // Send text to background script for translation
        const translation = await new Promise((resolve) => {
          chrome.runtime.sendMessage({
            action: 'PROCESS_WITH_AI',
            type: 'translation',
            text: selection.text,
            targetLanguage
          }, resolve);
        });

        sendResponse({ 
          message: `Text translated to ${targetLanguage}`,
          translation 
        });
        break;
      }

      case 'ANALYZE_SELECTION': {
        const selection = selectionService.getCurrentSelection();
        if (!selection || !selection.text) {
          throw new Error('No text selected');
        }

        // Send text to background script for analysis
        const analysis = await new Promise((resolve) => {
          chrome.runtime.sendMessage({
            action: 'PROCESS_WITH_AI',
            type: 'analysis',
            text: selection.text
          }, resolve);
        });

        sendResponse({ 
          message: 'Text analyzed',
          analysis 
        });
        break;
      }

      case 'START_SELECTION': {
        selectionService.startSelection();
        sendResponse({ message: 'Selection mode started' });
        break;
      }

      case 'STOP_SELECTION': {
        selectionService.stopSelection();
        sendResponse({ message: 'Selection mode stopped' });
        break;
      }

      default: {
        const { action, params } = request;
        if (action in domActions) {
          const result = domActions[action](...params);
          sendResponse(result);
        } else {
          sendResponse({ success: false, message: 'Unknown action' });
        }
      }
    }
  } catch (error) {
    console.error('Content script error:', error);
    sendResponse({ error: error.message });
  }

  return true; // Keep the message channel open for async response
});

// Initialize the content script
initMessageListener();

// Re-initialize on window load (in case the script loads after the page)
window.addEventListener('load', initMessageListener);
